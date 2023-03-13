var month = new Array();
var chart;
month[1] = "Jan";
month[2] = "Feb";
month[3] = "Mar";
month[4] = "Apr";
month[5] = "May";
month[6] = "Jun";
month[7] = "Jul";
month[8] = "Aug";
month[9] = "Sep";
month[10] = "Oct";
month[11] = "Nov";
month[12] = "Dec";


var monthArr = [
    { key: "04", value: "April" }, { key: "05", value: "May" }, { key: "06", value: "June" },
    { key: "07", value: "July" }, { key: "08", value: "August" }, { key: "09", value: "September" },
    { key: "10", value: "October" }, { key: "11", value: "November" }, { key: "12", value: "December" },
    { key: "01", value: "January" }, { key: "02", value: "February" }, { key: "03", value: "March" }
];
var d = new Date();
var dates = new Array();
var currMonth = d.getMonth();
var currYear = d.getFullYear();

let zoneArr = [];
let brandArr = [];
let data;

let filterData = [];
let chartBillsData = [];
let chartEcoData = [];
let monthArrayData = [];
let filterSelected = [];
let salesData;
let metricsSales;
let metricsBills;
let defaultBrand = true;
let firstLoad = true;
let containerId = 'containerSales';
let containerId1 = 'containerSpends';
let containerId2 = 'containerAvg';
let containerId3 = 'containerEco';
let containerId4 = 'containerBills';
let containerId5 = 'containerSalesAmount';
let zoneStaticArray = [];
zoneStaticArray.push({ zone: "EST", id: "1" });
zoneStaticArray.push({ zone: "NOR", id: "2" })
zoneStaticArray.push({ zone: "STH", id: "3" })
zoneStaticArray.push({ zone: "WST", id: "4" })
let resetFilters = false;
let userZoneList;
let finalUserZoneList;
let selectedStokistList = [];

let yearDate = new Array();

// 0nload Function --this will fetch the filter of input and load the Graphs
window.onload = function () {

    for (var i = 0; i <= 12; i++) {
        if (currMonth == 12) {
            currMonth = 0;
        }
        dates.push(currMonth);
        currMonth++;
    }
    $("#goButton").hide();
    showHideLoader(containerId, true);
    showHideLoader(containerId1, true);
    showHideLoader(containerId2, true);
    showHideLoader(containerId3, true);
    showHideLoader(containerId4, true);
    showHideLoader(containerId5, true);

    callYearMonthOptions();
}

function callYearMonthOptions() {
    $.ajax({
        url: getApiDomain(),
        type: "POST",
        data: JSON.stringify({ filter: "Year_Month_Filters" }),
        success: (function (dataResult) {
            let data = dataResult.data.data;
            if (userId != undefined) {
                trackCustomPageLoadEvent('Report Open', {
                    "companyId": companyId.toString(),
                    "userId": userId.toString(),
                    "dashboardId": dashboardId.toString(),
                    "reportName": dashboardFullName.toString()
                });
            }
            let selected = '';
            let yearArr = [];
            let yearIndex = -1;
            userZoneList = data[2];
            userZoneList = (userZoneList[0].Zonemeta).toString().replaceAll("'", "").split(",");
            finalUserZoneList = userZoneList;
            let firstYearVal = data[0].length > 0 ? data[0][0].year : "";
            $("#yearFilter").empty();
            $("#monthFilter").empty();
            $("#monthDependantComboId").empty();
            for (let i = 0, temp = data[0]; i < temp.length; i++) {
                yearIndex = yearArr.findIndex(obj => obj.year == temp[i].year);
                if (yearIndex == -1) {
                    yearArr.push({ year_no: temp[i].year_no, year: temp[i].year });
                }
                $("#monthDependantComboId").append("<option class='" + temp[i].year + "' value='" + parseInt(temp[i].month_no * 1) + "'>" + temp[i].month_nm + "</option>")
                selected = ""
                if (i == 0) {
                    selected = "selected"
                }
                if (firstYearVal == temp[i].year) {
                    $("#monthFilter").append("<option value='" + parseInt(temp[i].month_no * 1) + "' " + selected + ">" + temp[i].month_nm + "</option>")
                }
            }

            //YEAR SELECT
            for (let i = 0; i < yearArr.length; i++) {
                let selected = '';
                $("#yearFilter").append("<option " + selected + " value='" + yearArr[i].year + "'>" + yearArr[i].year + "</option>")
            }
            filterOption();

        }),
        error: (function (err) {
            if (err.status == 404) {
                $(".mainContent").html("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");

            }
            console.log(err);
        })
    });
}

let preSelectedFilterArray = [];

function storeSelectedFilter(filterValue, filter_Name) {

    const filterKeyPresent = preSelectedFilterArray.findIndex(obj => obj.filterName == filter_Name);
    if (filterKeyPresent == -1) {
        if (filterValue != '' && filterValue.length != 0) {
            preSelectedFilterArray.push({ filterName: filter_Name, filterValue: filterValue });
        }
    } else {
        if (filterValue == '' || filterValue.length == 0) {
            preSelectedFilterArray.splice(filterKeyPresent, 1);
        } else {
            preSelectedFilterArray[filterKeyPresent].filterValue = filterValue;
        }
        //  }
    }
}

function filterOption(asyncVar = true) {
    let month = $('#monthFilter').val();
    let year = '';
    $("#yearFilter option:selected").each(function () {
        var $this = $(this);
        if ($this.length) {
            var selText = $this.text();
            year += selText
        }
    });
    let filterData = []
    if (!resetFilters) {
        filterData = createFilterDepend();
    } else {
        // resetFilters = false;
        showHideLoader(containerId, true);
        showHideLoader(containerId1, true);
        showHideLoader(containerId2, true);
        showHideLoader(containerId3, true);
        showHideLoader(containerId4, true);
        showHideLoader(containerId5, true);
    }
    filterData.push({ dataType: "String", key: 'Year', value: year.toString() });
    filterData.push({ dataType: "String", key: 'Month', value: month.toString() });
    $("#goButton").hide();
    $.ajax({
        url: getApiDomain(),
        type: "POST",
        async: asyncVar,
        contentType: "application/json",
        data: JSON.stringify({ filter: "filter_Options_Dependency_V1_Test_Zone", 'chartDataForms': filterData }),
        success: function (dataResult) {
            let data = dataResult.data.data;
            if (!defaultBrand) {
                $("#goButton").show();
            }
            let selected = '';
            //Region Select
            // if (!filterSelected.includes("zone") && asyncVar) {
            if (lastChangedFilter != 'zone') {
                $("#zoneFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "zone");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[0]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }
                    $("#zoneFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].zone + "</option>");
                }
                $("#zoneFilter").multiselect('destroy');
                $('#zoneFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true
                });
            }
            // if (!filterSelected.includes("zone")) {
            //     $("#zoneFilter").empty();
            //     if (defaultBrand) {
            //         if (userZoneList[0] == '') {
            //             $("#zoneFilter").append("<option value= '1' selected>EST</option>")
            //             $("#zoneFilter").append("<option value= '2' selected>NOR</option>")
            //             $("#zoneFilter").append("<option value= '3' selected>STH</option>")
            //             $("#zoneFilter").append("<option value= '4' selected>WST</option>")
            //         } else {
            //             if (finalUserZoneList[0] == "") {
            //                 $("#zoneFilter").append("<option value= '1' selected>EST</option>")
            //                 $("#zoneFilter").append("<option value= '2' selected>NOR</option>")
            //                 $("#zoneFilter").append("<option value= '3' selected>STH</option>")
            //                 $("#zoneFilter").append("<option value= '4' selected>WST</option>")
            //             } else {
            //                 for (let i = 0; i < finalUserZoneList.length; i++) {
            //                     let idZone;
            //                     if (finalUserZoneList[i] == "EST") {
            //                         idZone = "1";
            //                     } else if (finalUserZoneList[i] == "NOR") { idZone = "2" } else if (finalUserZoneList[i] == "STH") { idZone = "3" } else if (finalUserZoneList[i] == "WST") { idZone = "4" }
            //                     $("#zoneFilter").append("<option value=" + idZone + " selected >" + finalUserZoneList[i] + "</option>");
            //                 }
            //             }
            //         }

            //     } else {
            //         let resultZone = [];
            //         for (let k = 0; k < data[0].length; k++) {
            //             let idZone;
            //             if (data[0][k].zone == "EST") {
            //                 idZone = "1";
            //             } else if (data[0][k].zone == "NOR") { idZone = "2" } else if (data[0][k].zone == "STH") { idZone = "3" } else if (data[0][k].zone == "WST") { idZone = "4" }
            //             resultZone.push({ zone: data[0][k].zone, id: idZone });
            //         }

            //         const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "zone");
            //         let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
            //         let userZoneList1 = [];
            //         if (userZoneList[0] == "") {
            //             userZoneList1 = data[0];
            //         } else {
            //             userZoneList1 = userZoneList;
            //         }

            //         for (let i = 0, temp = resultZone; i < temp.length; i++) {
            //             let selected = '';
            //             if (getStateIndex == -1 && getStateFilterValue == '' && getStateFilterValue.includes(temp[i].id)) {
            //                 selected = 'selected';
            //             } else if (getStateFilterValue.includes(temp[i].id)) {
            //                 selected = 'selected';
            //             } else if (userZoneList1.includes(temp[i].zone) && getStateIndex == -1) {
            //                 selected = 'selected';
            //             }
            //             $("#zoneFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].zone + "</option>");
            //         }

            //     }
            // else{
            //     let resultZone=[];
            //     for(let k=0; k< data[0].length;k++){
            //     resultZone.push(data[0][k].id);
            //     }

            //     const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "zone");
            //     let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
            //     let userZoneList1 = [];
            //     if(userZoneList[0] == "" ){
            //         userZoneList1 = data[0];
            //     }else{
            //         userZoneList1 = userZoneList;
            //     }

            //     for (let i = 0, temp = userZoneList1; i < temp.length; i++) {
            //         let selected = '';
            //         if (getStateIndex == -1 && getStateFilterValue == '' && getStateFilterValue.includes(userZoneList[i].id)) {
            //             selected = 'selected';
            //         } else if(getStateFilterValue.includes(userZoneList1[i].id)){
            //             selected ='selected';
            //         } else if(resultZone.includes(userZoneList1[i].id) && getStateIndex == -1){
            //             selected ='selected';
            //         }
            //         $("#zoneFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].zone + "</option>");
            //       }

            // }
            // $("#zoneFilter").multiselect('destroy');
            // $('#zoneFilter').multiselect({
            //     allSelectedText: 'All',
            //     numberDisplayed: 1,
            //     nonSelectedText: 'All',
            //     includeSelectAllOption: true,
            //     enableFiltering: true,
            //     enableCaseInsensitiveFiltering: true
            // });
            //   }
            //STate Select 
            if (lastChangedFilter != "statename") {
                $("#stateFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "statename");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[1]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }
                    $("#stateFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].statename + "</option>")
                }
                $("#stateFilter").multiselect('destroy');
                $('#stateFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true
                });
            }
            $("#stateFilter").multiselect("enable");
            //Brand Select
            if (lastChangedFilter != "brand") {
                if (data[2].findIndex(obj => obj.brand == 'Real 1 Ltr') == -1) {
                    defaultBrand = false;
                }
                $("#brandFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "brand");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[2]; i < temp.length; i++) {
                    let selected = '';
                    if (temp[i].brand == "Real 1 Ltr" && defaultBrand) {
                        selected = 'selected';
                    } else if (getStateIndex == -1 && getStateFilterValue == '' && !defaultBrand) {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id) && !defaultBrand) {
                        selected = 'selected';
                    }

                    $("#brandFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].brand + "</option>")
                }
            }

            //SKU  Select 
            if (lastChangedFilter != "sku") {
                $("#skuFilter").empty();
                let seleBrand = $("#brandFilter").val();
                // $("#skuFilter").append("<option value='All'>All</option>");
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "sku");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[3]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }
                    if (seleBrand == temp[i].brand_id)
                        $("#skuFilter").append("<option value='" + temp[i].id + "' " + selected + ">" + temp[i].sku + "</option>")
                }
                $("#skuFilter").multiselect('destroy');
                $('#skuFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true
                });
            }
            $("#skuFilter").prop('disabled', false);

            //Business Nature Select
            if (lastChangedFilter != "nature_of_business") {
                $("#businessNatureFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "nature_of_business");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[4]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }

                    $("#businessNatureFilter").append("<option value='" + temp[i].id + "' " + selected + ">" + temp[i].Nature_Of_Business + "</option>")
                }
                $("#businessNatureFilter").multiselect('destroy');
                $('#businessNatureFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true
                });
            }
            if (lastChangedFilter != "type_of_outlet") {
                $("#typeOfOutletFilter").empty();
                // $("#typeOfOutletFilter").append("<option value='' selected>All</option>");
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "type_of_outlet");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[5]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }
                    $("#typeOfOutletFilter").append("<option value='" + temp[i].id + "' " + selected + ">" + temp[i].type_of_outlet + "</option>");
                }
                $("#typeOfOutletFilter").multiselect('destroy');
                $('#typeOfOutletFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true
                });
            }
            if (lastChangedFilter != "stockisttype") {
                $("#stockistTypeFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "stockisttype");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[6]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].id)) {
                        selected = 'selected';
                    }
                    if (defaultBrand) {
                        selected = "selected";
                    } else if (selectedStokistList.includes(temp[i].stockisttype)) {
                        selected = "selected";
                    }
                    $("#stockistTypeFilter").append("<option value='" + temp[i].stockisttype + "' " + selected + ">" + temp[i].stockisttype + "</option>")
                }
                $("#stockistTypeFilter").multiselect('destroy');
                $('#stockistTypeFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    minWidth: 100
                });
            }

            // $("#claiNonClaimFilter").empty();
            // $("#claiNonClaimFilter").append("<option value= ''>All</option>")
            // for (let i = 0,dataCla = data[7]; i < data[7].length; i++) {
            //     let selected = '';
            //     if(dataCla[i].claimable == null){
            //         $("#claiNonClaimFilter").prop('disabled', true);
            //     }else{
            //         $("#claiNonClaimFilter").prop('disabled', false);
            //         $("#claiNonClaimFilter").append("<option " + selected + " value='" + dataCla[i].claimable + "'>" + dataCla[i].claimable + "</option>")
            //     }
            // }
            if (firstLoad || resetFilters) {
                // filterSelected.push("brand");
                yearMonthObjAPi();
                global_initialFilterData = getAllFiltersData();
                firstLoad = false;
                resetFilters = false;

            } else {
                $("#goButton").show();
            }
        },
        error: function (err) {
            if (err.status == 404) {
                $(".mainContent").html("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");
            }
            console.log(err);
        }
    });
}
// filters and change of filters functions
// function filterOption() {
//     let year = $('#yearFilter').val();
//     let month = $('#monthFilter').val();
//     let filterData = createFilterDepend();
//     filterData.push({ dataType: "String", key: 'Year', value: year.toString() });
//     filterData.push({ dataType: "String", key: 'Month', value: month.toString() });
//     $.ajax({
//         url: getApiDomain(),
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify({ filter: "filter_Options_Dependency_V1",'chartDataForms': filterData }),
//         success: function (dataResult) {
//            let data = dataResult.data.data;
//             let selected = '';

//         //Region Select
//         if(!filterSelected.includes("zone")){
//             $("#zoneFilter").empty();
//             let resultZone=[];
//             for(let k=0; k< data[0].length;k++){
//             resultZone.push(data[0][k].id);
//             }
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "zone");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = zoneStaticArray; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '' && getStateFilterValue.includes(zoneStaticArray[i].id)) {
//                     selected = 'selected';
//                 }else if(resultZone.includes(zoneStaticArray[i].id)){
//                     selected ='selected';
//                 }
//                 $("#zoneFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].zone + "</option>")
//               }
//             // for (let i = 0, temp = data[0]; i < temp.length; i++) {
//             //     selected = 'selected';
//             //     $("#zoneFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].zone + "</option>")
//             // }
//             $("#zoneFilter").multiselect('destroy');
//             $('#zoneFilter').multiselect({
//                 allSelectedText: 'All',
//                 numberDisplayed: 1,
//                 nonSelectedText: 'All',
//                 includeSelectAllOption: true,
//                 enableFiltering: true,
//                 enableCaseInsensitiveFiltering: true
//             });
//         }
//         //STate Select 
//         if(!filterSelected.includes("statename")){
//             $("#stateFilter").empty();
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "statename");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = data[1]; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '') {
//                     selected = 'selected';
//                 } else if (getStateFilterValue.includes(temp[i].id)) {
//                     selected = 'selected';
//                 }
//                 $("#stateFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].statename + "</option>")
//              }
//             // for (let i = 0, temp = data[1]; i < temp.length; i++) {
//             //     selected = 'selected';
//             //     $("#stateFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].statename + "</option>")
//             // }
//             $("#stateFilter").multiselect('destroy');
//             $('#stateFilter').multiselect({
//                 allSelectedText: 'All',
//                 numberDisplayed: 1,
//                 nonSelectedText: 'All',
//                 includeSelectAllOption: true,
//                 enableFiltering: true,
//                 enableCaseInsensitiveFiltering: true
//             });
//         }
//         $("#stateFilter").multiselect("enable");
//         //Brand Select
//         if(!filterSelected.includes("brand")){
//                 $("#brandFilter").empty();
//                 const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "brand");
//                 let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//                 for (let i = 0, temp = data[2]; i < temp.length; i++) {
//                     let selected = '';
//                     if (temp[i].brand == "Real 1 Ltr" && defaultBrand) {
//                             selected = 'selected';
//                     }else if (getStateIndex == -1 && getStateFilterValue == '' && !defaultBrand) {
//                         selected = 'selected';
//                     } else if (getStateFilterValue.includes(temp[i].id) && !defaultBrand) {
//                         selected = 'selected';
//                     }

//                     $("#brandFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].brand + "</option>")
//                 }
//                 //for (let i = 0, temp = data[2]; i < temp.length; i++) {
//                 // selected = "";
//                 // if (temp[i].brand == "Real 1 Ltr") {
//                 //             selected = 'selected';
//                 //     }
//                 //     $("#brandFilter").append("<option value='" + temp[i].id + "' " + selected + " >" + temp[i].brand + "</option>")
//                 // }
//         }

//         //SKU  Select 
//         if(!filterSelected.includes("sku")){
//             $("#skuFilter").empty();
//             let seleBrand = $("#brandFilter").val();
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "sku");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = data[3]; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '') {
//                     selected = 'selected';
//                 } else if (getStateFilterValue.includes(temp[i].id)) {
//                     selected = 'selected';
//                 }else if(defaultBrand){
//                     selected = 'selected';
//                 }
//                 if (temp[i].brand_id == parseInt(seleBrand)) 
//                 $("#skuFilter").append("<option value='" + temp[i].id + "' '"+selected+"'>" + temp[i].sku + "</option>")
//           }
//             // for (let i = 0, temp = data[3]; i < temp.length; i++) {
//             //     if (temp[i].brand_id == parseInt(seleBrand)) {
//             //         selected = "selected";
//             //         $("#skuFilter").append("<option value='" + temp[i].id + "' " + selected + ">" + temp[i].sku + "</option>")
//             //     }
//             // }
//             $("#skuFilter").multiselect('destroy');
//             $('#skuFilter').multiselect({
//                 allSelectedText: 'All',
//                 numberDisplayed: 1,
//                 nonSelectedText: 'All',
//                 includeSelectAllOption: true,
//                 enableFiltering: true,
//                 enableCaseInsensitiveFiltering: true
//             });
//         }

//         //Business Nature Select
//         if(!filterSelected.includes("nature_of_business")){
//             $("#businessNatureFilter").empty();
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "nature_of_business");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = data[4]; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '') {
//                     selected = 'selected';
//                 } else if (getStateFilterValue.includes(temp[i].id)) {
//                     selected = 'selected';
//                 }


//                 $("#businessNatureFilter").append("<option value='" + temp[i].id + "' " + selected + ">"  + temp[i].Nature_Of_Business + "</option>")
//           }
//           //  $("#businessNatureFilter").append("<option value=''>All</option>");
//             // for (let i = 0, temp = data[4]; i < temp.length; i++) {
//             //     $("#businessNatureFilter").append("<option value='" + temp[i].id + "' selected>" + temp[i].Nature_Of_Business + "</option>")
//             // }
//             $("#businessNatureFilter").multiselect('destroy');
//             $('#businessNatureFilter').multiselect({
//                 allSelectedText: 'All',
//                 numberDisplayed: 1,
//                 nonSelectedText: 'All',
//                 includeSelectAllOption: true,
//                 enableFiltering: true,
//                 enableCaseInsensitiveFiltering: true
//             });
//         }

//         //Contribution Class Select
//         if(!filterSelected.includes("type_of_outlet")){
//             $("#typeOfOutletFilter").empty();
//             $("#typeOfOutletFilter").append("<option value='' selected>All</option>")
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "type_of_outlet");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = data[5]; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '' && !defaultBrand) {
//                     selected = 'selected';
//                 } else if (getStateFilterValue.includes(temp[i].id) && !defaultBrand) {
//                     selected = 'selected';
//                 }

//                 $("#typeOfOutletFilter").append("<option value='" + temp[i].id + "' " + selected + ">"  + temp[i].type_of_outlet + "</option>")
//           }
//             // for (let i = 0, temp = data[5]; i < temp.length; i++) {
//             //     selected = "";
//             //     $("#typeOfOutletFilter").append("<option value='" + temp[i].id + "' " + selected + ">" + temp[i].type_of_outlet + "</option>")
//             // }
//         }
//         if(!filterSelected.includes("stockisttype")){
//             $("#stockistTypeFilter").empty();
//             const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "stockisttype");
//             let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
//             for (let i = 0, temp = data[6]; i < temp.length; i++) {
//                 let selected = '';
//                 if (getStateIndex == -1 && getStateFilterValue == '') {
//                     selected = 'selected';
//                 } else if (getStateFilterValue.includes(temp[i].id)) {
//                     selected = 'selected';
//                 }


//                 $("#stockistTypeFilter").append("<option value='" + temp[i].id + "' " + selected + ">"  + temp[i].stockisttype + "</option>")
//           }
//             // for (let i = 0, temp = data[6]; i < temp.length; i++) {
//             //    selected = "selected";
//             //    $("#stockistTypeFilter").append("<option value='" + temp[i].stockisttype + "' " + selected + ">" + temp[i].stockisttype + "</option>")
//             // }
//             $("#stockistTypeFilter").multiselect('destroy');
//             $('#stockistTypeFilter').multiselect({
//                allSelectedText: 'All',
//                numberDisplayed: 1,
//                nonSelectedText: 'All',
//                includeSelectAllOption: true,
//                enableFiltering: true,
//                enableCaseInsensitiveFiltering: true,
//                minWidth:100
//             });
//         }
//         if(defaultBrand){
//             filterSelected.push("brand");
//             yearMonthObjAPi();
//             global_initialFilterData = getAllFiltersData();
//             defaultBrand = false;
//         }else{
//             $("#goButton").show();
//         }
//         },
//         error: function (err) {
//         if(err.status == 404){
//             $(".mainContent").html("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");
//         }
//         console.log(err);
//         }
//     });
// }


//All on change function
$(document).on('change', '#yearFilter', function () {
    let filterName = $(this).val();
    let seleMonth = $("#monthFilter").val();
    $(this).data('options', $('#monthDependantComboId option').clone());
    var finalArr = $(this).data('options').filter('[class="' + filterName + '"]');

    var html = "";
    let selected = '';
    for (i = 0; i < finalArr.length; i++) {
        jQuery(finalArr[i]).removeAttr("class");
        selected = ''
        if (finalArr[i].value == seleMonth) {
            selected = 'selected';
        }
        html += "<option value='" + finalArr[i].value + "' " + selected + ">" + finalArr[i].text + "</option>"
    }
    $("#monthFilter").html(html);
});

let lastChangedFilter = "";
$(document).on("change", ".filter", function () {
    let filterElement = $(this);
    let selectedValues = filterElement.val();
    let selectedFiltername = filterElement[0].name;
    if (this.name == 'brand') {
        defaultBrand = false;
    }
    lastChangedFilter = selectedFiltername;
});

$(document).on('change', '.filter', debounce(function () {

    let filterName = this.name;
    let filterValue = $(this).val();
    if (filterValue.length == 0) {
        return;
    }

    $("#filterChange").show();
    let selectedOptionsList = $(this).find("option:selected");
    let selectedOptions = '';
    for (let i = 0; i < selectedOptionsList.length; i++) {
        selectedOptions += jQuery(selectedOptionsList[i]).text() + ",";
    }
    storeSelectedFilter(filterValue, filterName);

    let tempArr = filterSelected.filter(obj => obj.name != filterName);
    filterSelected = tempArr;
    filterSelected.push(
        {
            name: filterName,
            value: filterValue
        });
    // if (filterName == "zone") {
    //     selectedZoneList = [];
    //     $("#stateFilter").multiselect("disable");
    //     for (let fl = 0; fl < preSelectedFilterArray.length; fl++) {
    //         if (preSelectedFilterArray[fl].filterName == "statename") {
    //             // preSelectedFilterArray = preSelectedFilterArray.filter(item => item !== preSelectedFilterArray[fl].filterName)
    //             preSelectedFilterArray.splice(fl, 1);;
    //         }
    //     }
    //     for (let i = 0; i < filterValue.length; i++) {
    //         for (let i = 0; i < filterSelected.length; i++) {
    //             if (filterSelected[i] == "statename") {
    //                 //filterSelected.splice(i);
    //                 filterSelected = filterSelected.filter(item => item !== filterSelected[i])
    //             }
    //         }
    //         selectedZoneList.push(filterValue[i]);
    //     }
    // } else if (filterName == "statename") {
    //     selectedStateList = [];
    //     selectedZoneList = [];
    //     for (let i = 0; i < filterValue.length; i++) {
    //         for (let i = 0; i < filterSelected.length; i++) {
    //             if (filterSelected[i] == "zone") {
    //                 //filterSelected.splice(i);
    //                 filterSelected = filterSelected.filter(item => item !== filterSelected[i])
    //             }
    //         }
    //         selectedStateList.push(filterValue[i]);
    //     }
    // } else if (filterName == "nature_of_business") {
    //     selectedNobList = [];
    //     for (let i = 0; i < filterValue.length; i++) {
    //         selectedNobList.push(filterValue[i]);
    //     }
    // } else if (filterName == "stockisttype") {
    //     selectedStokistList = [];
    //     for (let i = 0; i < filterValue.length; i++) {
    //         selectedStokistList.push(filterValue[i]);
    //     }
    // } else if (filterName == "typeOfOutletFilter") {
    //     selectedtypeOfOuList = [];
    //     for (let i = 0; i < filterValue.length; i++) {
    //         selectedtypeOfOuList.push(filterValue[i]);
    //     }
    // } else if (filterName == "brand") {
    //     $("#skuFilter").prop('disabled', true);
    //     for (let i = 0; i < filterSelected.length; i++) {
    //         if (filterSelected[i] == "sku") {
    //             //filterSelected.splice(i);
    //             filterSelected = filterSelected.filter(item => item !== filterSelected[i])
    //         }
    //     }
    // }
    var notSelected = $('#' + this.id).find('option').not(':selected');
    var arrayOfUnselected = notSelected.map(function () {
        return this.value;
    }).get();

    // if (notSelected.length != 0) {
    //     if (filterValue == "All" || filterValue.length == 0) {

    //     } else {
    //         filterSelected.push(filterName);
    //     }
    // }
    filterOption();
    if (userId != undefined) {
        trackCustomEvent('Filter Changed', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": dashboardFullName.toString(),
            "filterName": $(this).attr('name').toString(),
            "filterValue": selectedOptions.toString()
        });
    }
}, 2500));

function createFilterDepend() {
    let filterData = [];
    for (let i = 0; i < filterSelected.length; i++) {
        let filterValue = filterSelected[i].value;
        let filterName = filterSelected[i].name;
        if (filterName != "year" && filterName != "month") {

            if (filterName == "zone" || filterName == "stockisttype") {
                let filterValueText = '';
                for (let i = 0; i < filterValue.length; i++) {
                    var selText = $('select[name =' + filterName + ']').children('option[value = ' + filterValue[i] + ']').text();
                    filterValueText += selText + ',';
                }

                filterValue = filterValueText;
            }

            filterData.push({
                dataType: "String",
                key: filterName,
                value: filterValue.toString()
            });
        }
        if (filterName == 'brand' && filterValue != '18') {
            defaultBrand = false;
        }
    }
    return filterData;
}
function onClickGo(filter) {
    $("#goButton").hide();
    // showHideLoader(containerId6, true);
    let filterName = "Go Button";
    chartsList=[];
    let selectedOptionsList = $(this).find("option:selected");
    let selectedOptions = '';
    for (let i = 0; i < selectedOptionsList.length; i++) {
        selectedOptions += jQuery(selectedOptionsList[i]).text() + ",";
    }
    if (userId != undefined) {
        trackCustomEvent('Go Button', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": dashboardFullName.toString(),
            "filterName": "Comment",
            "filterValue": filter.toString()
        });
    }
    yearMonthObjAPi();
}

$(document).on("click", "#filterChange", debounce(function () {
    $("#goButton").hide();
    showHideLoader(containerId, true);
    showHideLoader(containerId1, true);
    showHideLoader(containerId2, true);
    showHideLoader(containerId3, true);
    showHideLoader(containerId4, true);
    showHideLoader(containerId5, true);
    chartsList=[];
    // showHideLoader(containerId6, true);
    let filterName = "Go Button";
    let selectedOptionsList = $(this).find("option:selected");
    let selectedOptions = '';
    for (let i = 0; i < selectedOptionsList.length; i++) {
        selectedOptions += jQuery(selectedOptionsList[i]).text() + ",";
    }
    if (userId != undefined) {
        trackCustomEvent('Go Button', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": dashboardFullName.toString(),
            // "filterName": filterName.toString(),
            "filterValue": selectedOptions.toString()
        });
    }
    yearMonthObjAPi();
}, 0));

// All API functions
var saleSpendReqObj;

function salesSpendAvgDataFromApi(yearMonthObj) {
    if (saleSpendReqObj) {
        saleSpendReqObj.abort();
        saleSpendReqObj = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let sameMonthLastYear = getYearBeforeLast(yearMonthObj.sameMonthLastYear);

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    let procedureName = 'SalesAndSpend_Trend_Procedure';
    saleSpendReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            let data = resultData.data.data[0];
            saleSpendReqObj = null;
            billsDataFromApi(yearMonthObj)
            salesData = data;
            showHideLoader(containerId, false);
            showHideLoader(containerId1, false);
            showHideLoader(containerId2, false);
            monthArrayData = [];
            for (let k = 0; k < salesData.length; k++) {
                monthArrayData.push(month[salesData[k].Month_No] + "-" + (salesData[k].Year_Mnth).substring(2, 4))
            }
            createSalesChatData(data);
            createSpendChartData(data);
            createSalesSpendsChartData(data);
        }),
        error: (function (err) {
            saleSpendReqObj = null;
            console.log(err);
        })
    });
}

var ecoDataReqObj;

function ecoDataFromApi(yearMonthObj) {
    if (ecoDataReqObj) {
        ecoDataReqObj.abort();
        ecoDataReqObj = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let sameMonthLastYear = getYearBeforeLast(yearMonthObj.sameMonthLastYear);

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    filterData.push({ dataType: "String", key: 'Uid', value: randomUid() });
    let procedureName = 'EcoAndBills_Trend__Procedure';
    ecoDataReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            ecoDataReqObj = null;
            let data = resultData.data.data[0];
            monthArrayData = [];
            for (let k = 0; k < data.length; k++) {
                monthArrayData.push(month[parseInt(data[k].year_mnth.substring(4, 6))] + "-" + data[k].year_mnth.substring(2, 4));
            }
            showHideLoader(containerId3, false);
            createEcoChatData(data);

        }),
        error: (function (err) {
            ecoDataReqObj = null;
            console.log(err);
        })
    });
}

var billsDataObj;

function billsDataFromApi(yearMonthObj) {
    if (billsDataObj) {
        billsDataObj.abort();
        billsDataObj = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let sameMonthLastYear = getYearBeforeLast(yearMonthObj.sameMonthLastYear);

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    filterData.push({ dataType: "String", key: 'Uid', value: randomUid() });
    let procedureName = 'BillsDistribution_TrendView__Procedure';
    billsDataObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            let data = resultData.data.data[0];
            monthArrayData = [];
            for (let k = 0; k < data.length; k++) {
                monthArrayData.push(month[parseInt(data[k].year_mnth.substring(4, 6))] + "-" + data[k].year_mnth.substring(2, 4));
            }
            billsDataObj = null;
            showHideLoader(containerId4, false);
            showHideLoader(containerId5, false);
            createBillsChatData(data);
        }),
        error: (function (err) {
            billsDataObj = null;
            console.log(err);
        })
    });
}

var metricsSalesSpend;

function salesAndSpendAndAvgMetrixDataFromApi(yearMonthObj) {
    if (metricsSalesSpend) {
        metricsSalesSpend.abort();
        metricsSalesSpend = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let finacialYear = (getYearBeforeLast(yearMonthObj.sameMonthLastYear)).substring(0, 5);
    let sameMonthLastYear = finacialYear + "4";

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    let procedureName = 'KeyMetrics_Trend_View_Procedure';
    metricsSalesSpend = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            let data = resultData.data.data[0];
            metricsSalesSpend = null;
            metricsBillsDataFromApi(yearMonthObj);
            console.log(data);
            displayMetricsData(data);
        }),
        error: (function (err) {
            metricsSalesSpend = null;
            console.log(err);
        })
    });
}

var metricsEcoObj;

function metricsEcoDataFromApi(yearMonthObj) {
    if (metricsEcoObj) {
        metricsEcoObj.abort();
        metricsEcoObj = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let finacialYear = (getYearBeforeLast(yearMonthObj.sameMonthLastYear)).substring(0, 5);
    let sameMonthLastYear = finacialYear + "4";

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    filterData.push({ dataType: "String", key: 'Uid', value: randomUid() });
    let procedureName = 'Metrics_ECO_Trend_Procedure';
    metricsEcoObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            $("#totalEcoTableId td").remove();
            $("#totalEcoTableId td").empty();
            let data = resultData.data.data[0];
            metricsEcoObj = null;
            ecoValueShareData = data[0].Total_ECO
            $("#totalEcoTableId").append("<td class='metricsValue'>" + numberFormatter(data[0].Total_ECO) + "</td>");
        }),
        error: (function (err) {
            metricsEcoObj = null;
            console.log(err);
        })
    });
}
let ecoValueShareData;
var metricsBillObj;

function metricsBillsDataFromApi(yearMonthObj) {
    if (metricsBillObj) {
        metricsBillObj.abort();
        metricsBillObj = null;
    }
    let filterData = createFilter();
    let currentYearMonth = yearMonthObj.currentYearMonth;
    let finacialYear = (getYearBeforeLast(yearMonthObj.sameMonthLastYear)).substring(0, 5);
    let sameMonthLastYear = finacialYear + "4";

    filterData.push({ dataType: "String", key: 'currentYearMonth', value: currentYearMonth });
    filterData.push({ dataType: "String", key: 'sameMonthLastYear', value: sameMonthLastYear });
    filterData.push({ dataType: "String", key: 'Uid', value: randomUid() });
    let procedureName = 'Metrics_Bills_TrendView__Procedure';
    metricsBillObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ chartDataForms: filterData, filter: procedureName, 'filterHash': cTageHash(procedureName + JSON.stringify(filterData)), 'dashboardId': dashboardId }),
        success: (function (resultData) {
            let data = resultData.data.data[0];
            $("#totalBillsTableId td").remove();
            $("#avgSalesTableId td").remove();
            $("#totalBillsTableId td").empty();
            $("#avgSalesTableId td").empty();
            metricsBillObj = null;
            metricsBills = data[0].Total_Bills;
            totalBillsValueShareData = metricsBills
            averageSalesShareData = metricsSales / metricsBills
            $("#totalBillsTableId").append("<td class='metricsValue'>" + numberFormatter(data[0].Total_Bills) + "</td>");
            $("#avgSalesTableId").append("<td class='metricsValue'>" + numberFormatter(metricsSales / metricsBills) + "</td>");
        }),
        error: (function (err) {
            metricsBillObj = null;
            console.log(err);
        })
    });
}
let chartsList=[];


// All functions for loading the Data into Chart view
let totalBillsValueShareData;
let averageSalesShareData;

let firstFlag = true;
function createSalesChatData(salesData) {
    let chartsalesData = [];
    if (salesData.length <= 0) {
        $("#containerSales").append("<div class='noData'>No Data</div>");
        return;
    }
    for (let i = 0; i < salesData.length; i++) {
        chartsalesData.push(salesData[i].Sales * 1)
    }
    if (firstFlag) {

        Highcharts.wrap(Highcharts.Chart.prototype, 'contextMenu', function (proceed) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            // Correct for chart position
            var pos = Highcharts.offset(this.container);
            var defaultPadding = 5 * 2;
            this.exportContextMenu.style.top = pos.top + 'px';
            //this.exportContextMenu.style.top = (parseInt(this.exportContextMenu.style.top) + pos.top) + 'px';
            // this.exportContextMenu.style.left = (pos.left + this.chartWidth - this.exportMenuWidth - parseInt(this.exportContextMenu.style.padding) - defaultPadding) + 'px';
            this.exportContextMenu.style.width = this.exportMenuWidth + 'px';
            //this.exportContextMenu.style.right = 0;
            this.exportContextMenu.style.right = $(window).width() - (parseInt(pos.left) + $(this.container).width() - parseInt(this.exportContextMenu.style.right)) + 20 + 'px';
            // Move it to the body
            Highcharts.doc.body.appendChild(this.exportContextMenu);
        });
        firstFlag = false;
    }

  let chart1 =  Highcharts.chart('containerSales', {
        chart: {
            type: 'column',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
            // marginBottom: 0
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                opposite: false,
                height: 10,
            },
            crosshair: true,
        },
        yAxis: {
            title: {
                text: 'Sales<br>(PTS)'
            },
            labels: {
                formatter: function () {
                    return '<span style="color:{point.color}">' + numberFormatter(this.value) + '</span>';
                }
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' Sales Amount : <b>' + numberFormatter(this.y) + '</b><br/>';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Sales(PTS)',
            data: chartsalesData,
            dataLabels: {
                enabled: true,
                inside: false,
                verticalAlign: 'top',
                //crop: false,
                //overflow: 'none',
                formatter: function () {
                    return numberFormatter(this.y);
                }
            }
        }]
    });
    chartsList.push(chart1);
}

function createSpendChartData(spendData) {
    console.log(spendData);
    if (spendData.length <= 0) {
        $("#containerSpends").append("<div class='noData'>No Data</div>");
        return;
    }
    let chartSpendData = [];
    for (i = 0; i < spendData.length; i++) {
        chartSpendData.push(spendData[i].Spend * 1)
    }

  let chart2 =  Highcharts.chart('containerSpends', {
        chart: {
            type: 'column',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                height: 0,
            },
            crosshair: true
        },
        yAxis: {
            title: {
                text: 'Spend'
            },
            labels: {
                // format: '{value} Cr',
                // style: {
                //     color: Highcharts.getOptions().colors[0]
                // }
                formatter: function () {
                    return '<span style="color:{point.color}">' + numberFormatter(this.value) + '</span>';
                }
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' Spend Amount : <b>' + numberFormatter(this.y) + '</b><br/>';
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Spend',
            data: chartSpendData,
            dataLabels: {
                enabled: true,
                inside: false,
                verticalAlign: 'top',
                //crop: false,
                //overflow: 'none',
                formatter: function () {
                    return numberFormatter(this.y);
                }
            }
            // tooltip: {
            //     valueSuffix: ' Cr'
            // }
        }]
    });
    chartsList.push(chart2);
}

function createSalesSpendsChartData(salesSpendData) {
    let chartSaleSpendData = [];
    if (salesSpendData.length <= 0) {
        $("#containerAvg").append("<div class='noData'>No Data</div>");
        return;
    }
    for (i = 0; i < salesSpendData.length; i++) {
        chartSaleSpendData.push(salesSpendData[i].SpendSales * 1)
    }

   let chart3 = Highcharts.chart('containerAvg', {
        chart: {
            type: 'line',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                height: 0,
            },
            crosshair: true
        },
        yAxis: {
            title: {
                html: true,
                text: 'Spend/<br>Sales(PTR)',
                style: {
                    position: 'fixed',
                    bottom: '0px',
                    left: '0',
                    fontSize: '11px'
                }
            },
            labels: {
                formatter: function () {
                    return '<span style="color:{point.color}">' + this.value + ' %</span>';
                }
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' Spend/Sales Amount : <b>' + this.y + ' %</b><br/>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Spend/Sales(PTR)',
            data: chartSaleSpendData,
            dataLabels: {
                enabled: true,
                verticalAlign: 'top',
                inside: false,
                //crop: false,
                //overflow: 'none',
                formatter: function () {
                    return this.y + ' %';
                }
            }
            // tooltip: {
            //     valueSuffix: ' Cr'
            // }
        }]
    });
    chartsList.push(chart3);
}

function createEcoChatData(ecoData) {
    console.log(ecoData);
    if (ecoData.length <= 0) {
        $("#containerEco").append("<div class='noData'>No Data</div>");
        return;
    }
    chartEcoData = [];
    for (i = 0; i < ecoData.length; i++) {
        chartEcoData.push(ecoData[i].Curr_ECO * 1);
    }
  let chart4 =  Highcharts.chart('containerEco', {
        chart: {
            type: 'line',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                height: 0,
            },
            crosshair: true
        },
        yAxis: {
            title: {
                text: 'ECO'
            },
            labels: {
                formatter: function () {
                    return '<span style="color:{point.color}">' + numberFormatter(this.value) + '</span>';
                }
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' ECO : <b>' + numberFormatter(this.y) + '</b><br/>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'CM',
            data: chartEcoData,
            dataLabels: {
                enabled: true,
                verticalAlign: 'top',
                inside: true,
                formatter: function () {
                    return numberFormatter(this.y);
                }
            }
            // tooltip: {
            //     valueSuffix: ' Cr'
            // }

        }]
    });

    chartsList.push(chart4);

}

function createBillsChatData(billsData) {
    if (billsData.length <= 0) {
        $("#containerBills").append("<div class='noData'>No Data</div>");
        $("#containerSalesAmount").append("<div class='noData'>No Data</div>");
        return;
    }
    chartBillsData = [];
    for (i = 0; i < billsData.length; i++) {
        chartBillsData.push(billsData[i].Curr_Bills * 1);
    }
 let chart5 =  Highcharts.chart('containerBills', {
        chart: {
            type: 'line',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                height: 0,
            },
            crosshair: true
        },
        yAxis: {
            title: {
                text: 'Bills'
            },
            labels: {
                formatter: function () {
                    return '<span style="color:{point.color}">' + numberFormatter(this.value) + '</span>';
                }
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' #Bill : <b>' + numberFormatter(this.y) + '</b><br/>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'CM',
            data: chartBillsData,
            dataLabels: {
                enabled: true,
                verticalAlign: 'top',
                inside: true,
                formatter: function () {
                    return numberFormatter(this.y);
                }
            }
            // tooltip: {
            //     valueSuffix: ' Cr'
            // }
        }]
    });
    chartsList.push(chart5);
    avgOfBillsAndEcoDataChart(chartBillsData, salesData);
}

function avgOfBillsAndEcoDataChart(chartBillsData, salesData) {
    let avgDataForChart = [];
    avgDataForChart = [];
    let salesDataSet = salesData;
    for (let i = 0; i < chartBillsData.length; i++) {
        if (salesDataSet[i].Sales) {
            let avgValue = (salesDataSet[i].Sales / chartBillsData[i]);
            avgDataForChart.push(avgValue);
        }
    }
 let chart6 = Highcharts.chart('containerSalesAmount', {
        chart: {
            type: 'line',
            events: {
                load: function () {
                    var catLen = this.xAxis[0].categories.length - 1;
                    this.xAxis[0].setExtremes(catLen - 14, catLen);
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthArrayData,
            max: 15,
            scrollbar: {
                enabled: true,
                height: 10,
            },
            crosshair: true
        },
        yAxis: {
            title: {
                text: 'AVG'
            },
            labels: {
                formatter: function () {
                    return '<span style="color:{point.color}">' + numberFormatter(this.value) + '</span>';
                }
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size: 10px">' + this.key + '</span><br/>' +
                    ' AVG : <b>' + numberFormatter(this.y) + '</b><br/>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'CM',
            data: avgDataForChart,
            dataLabels: {
                enabled: true,
                // inside: true,
                verticalAlign: 'top',
                formatter: function () {
                    return numberFormatter(this.y);
                }
            }
        }]
    });
    chartsList.push(chart6);
}
let totalvaluesShareData;

function displayMetricsData(data) {
    let totalValues = data;
    totalvaluesShareData = totalValues;
    $("#totalSalesTableId td").remove();
    $("#totalSpendTableId td").remove();
    $("#SpendSalesTableId td").remove();
    $("#totalSalesTableId td").empty();
    $("#totalSpendTableId td").empty();
    $("#SpendSalesTableId td").empty();
    metricsSales = totalValues[0].Sales;
    $("#totalSalesTableId").append("<td class='metricsValue'>" + numberFormatter(totalValues[0].Sales) + "</td>");
    $("#totalSpendTableId").append("<td class='metricsValue'>" + numberFormatter(totalValues[0].Spend) + "</td>");
    $("#SpendSalesTableId").append("<td class='metricsValue'>" + numberFormatter(totalValues[0].SpendSales) + " %</td>");
}

// functions for validating the Data

function numberFormatter(num) {

    num = parseFloat(num);
    if (isNaN(num)) {
        return "NA";
    }

    if (num / 10000000 >= 1) {
        return getnum(num / 10000000) + " Cr";
    } else if (num / 100000 >= 1) {
        return getnum(num / 100000) + " L";
    } else if (num / 1000 >= 1) {
        return getnum(num / 1000) + " K";
    } else {
        return getnum(num);
    }

    function getnum(calcNum) {
        let temp = calcNum.toFixed(2);
        return (new Intl.NumberFormat('en-IN').format(temp));

    }
}

function showHideLoader(containerId, display) {
    if (display) {
        $("#" + containerId).empty();
        $("#" + containerId).append("<div class='loader'></div>");
    } else {
        $("#" + containerId).find('div[class="loader"]').remove();
    }
}

function createFilter() {
    let filterData = [];
    $(".filter").each(function () {
        let filterValue = $(this).val();
        let filterName = $(this).attr("name");
        if (filterValue == null || filterValue == undefined) {
            filterValue = "";
        }
        if (filterName == "zone") {
            let filterValueZone = '';
            $("#zoneFilter option:selected").each(function () {
                var $this = $(this);
                if ($this.length) {
                    var selText = $this.text();
                    filterValueZone += selText + ',';
                }
            });
            filterValue = filterValueZone.replace(/,\s*$/, "");
            filterData.push({ dataType: "String", key: filterName, value: filterValueZone.toString() });
        } else if (filterName == "statename") {
            let filterValue = '';
            //mahesh
            var notSelected = $("#stateFilter").find('option').not(':selected');
            var arrayOfUnselected = notSelected.map(function () {
                return this.value;
            }).get();
            if (arrayOfUnselected == 0) {
                filterValue = "";
            } else {
                $("#stateFilter option:selected").each(function () {
                    var $this = $(this);
                    if ($this.length) {
                        var selText = $this.text();
                        filterValue += selText + ',';
                    }
                });
                filterValue = filterValue.replace(/,\s*$/, "");
            }
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
            // let filterValue='';
            // $("#stateFilter option:selected").each(function () {
            //     var $this = $(this);
            //     if ($this.length) {
            //      var selText = $this.text();
            //      filterValue += selText+','
            //    }
            //  });
            //  filterValue = filterValue.replace(/,\s*$/, "");
            // filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });    
        } else if (filterName == "nature_of_business") {
            let filterValue = '';
            $("#businessNatureFilter option:selected").each(function () {
                var $this = $(this);
                if ($this.length) {
                    var selText = $this.text();
                    if (selText != "All") {
                        filterValue += selText + ",";
                    }
                }
            });
            filterValue = filterValue.replace(/,\s*$/, "");
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
        } else if (filterName == "type_of_outlet") {
            let filterValue = '';
            $("#typeOfOutletFilter option:selected").each(function () {
                var $this = $(this);
                if ($this.length) {
                    var selText = $this.text();
                    if (selText != "All") {
                        filterValue += selText + ",";
                    }
                }
            });
            filterValue = filterValue.replace(/,\s*$/, "");
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
        } else if (filterName == "stockisttype") {
            var notSelected1 = $('#stockistTypeFilter').find('option').not(':selected');
            var arrayOfUnselected1 = notSelected1.map(function () {
                return this.value;
            }).get();
            if (arrayOfUnselected1 == 0) {
                filterValue = "";
            }
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
        } else if (filterName == "sku") {
            var notSelected2 = $('#skuFilter').find('option').not(':selected');
            var arrayOfUnselected2 = notSelected2.map(function () {
                return this.value;
            }).get();
            if (arrayOfUnselected2 == 0) {
                filterValue = "";
            }
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
        } else if (!(filterName == 'month' || filterName == 'year')) {
            filterData.push({ dataType: "String", key: filterName, value: filterValue.toString() });
        }
    });
    // filterData.push({ dataType: "String", key: 'currentYearMonth', value: "" + year + month });
    return filterData;
}

var yearMonthRequestObj;
var yearMonthObj = {};

function yearMonthObjAPi() {
    if (yearMonthRequestObj) {
        yearMonthRequestObj.abort();
        yearMonthRequestObj = null;
    }
    yearMonthObj = {};
    let year = $("#yearFilter").val();
    let month = $('#monthFilter').val();
    let data = [];
    data.push({ dataType: "String", key: 'yearFY', value: year.toString() });
    data.push({ dataType: "String", key: 'month', value: month.toString() });

    showHideLoader(containerId, true);
    showHideLoader(containerId1, true);
    showHideLoader(containerId2, true);
    showHideLoader(containerId3, true);
    showHideLoader(containerId4, true);
    showHideLoader(containerId5, true);

    yearMonthRequestObj = $.ajax({
        type: 'POST',
        url: getApiDomain(),
        data: JSON.stringify({ 'filter': "YearMonth_Procedure", 'chartDataForms': data }),
        success: (function (dataResult) {
            let data = dataResult.data.data[0];
            yearMonthRequestObj = null;


            let currentYearMonth = '';
            let sameMonthLastYear = '';



            for (let i = 0; i < data.length; i++) {
                currentYearMonth += parseInt(data[i].Curr_Year_Month) + ',';
                sameMonthLastYear += parseInt(data[i].LY_Year_Month) + ',';

            }
            yearMonthObj = {};
            yearMonthObj.currentYearMonth = currentYearMonth.slice(0, currentYearMonth.length - 1);
            yearMonthObj.sameMonthLastYear = sameMonthLastYear.slice(0, sameMonthLastYear.length - 1);

            salesSpendAvgDataFromApi(yearMonthObj);
            ecoDataFromApi(yearMonthObj);
            salesAndSpendAndAvgMetrixDataFromApi(yearMonthObj);
            metricsEcoDataFromApi(yearMonthObj);

        }),
        error: (function (e) {
            yearMonthRequestObj = null;
            if (e.status == 404) {
                $(".mainContent").replaceWith("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");
            }
            console.log(e);

        })
    });
}

function numberAvgFormatter(numberAvg) {
    let floorValue = Math.floor(numberAvg);
    if ((numberAvg - floorValue) < 0.125) {
        return parseInt(numberAvg);
    } else if ((numberAvg - floorValue) < 0.275) {
        return parseInt(numberAvg) + 0.25;
    } else if ((numberAvg - floorValue) < 0.625) {
        return parseInt(numberAvg) + 0.5;
    } else if ((numberAvg - floorValue) < 0.875) {
        return parseInt(numberAvg) + 0.75;
    } else {
        return Math.round(numberAvg);
    }
}

function cTageHash(ProcedureNameAndPayload) {
    let hashkey = CryptoJS.MD5(ProcedureNameAndPayload).toString();
    console.log('hashkey - ' + hashkey);
    return hashkey;
}

function randomUid() {
    let userId = $("#userId").val();
    return Math.floor((Math.random() * 1000000000) + 1) + "" + userId;
}

function sharedFormatter(num) {
    if (num == null) {
        return 0;
    }
    return parseFloat(num).toFixed(2);
}

//to remove HTML tags from a string (used for share data function)
function removeHTMLTags(htmlString) {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}

function getYearBeforeLast(yearMonthString) {
    let year = parseInt(yearMonthString.slice(0, -2));
    let month = yearMonthString.slice(4);

    //because we need the year before last:
    lastToPreviousYear = year - 1;

    return lastToPreviousYear.toString() + month

}
setInterval(function () {intervalScroll()}, 1000);
function intervalScroll(){
    if(chartsList.length != 0){
    chartsList.forEach(chart => {
        chart.xAxis[0].update({
            events: {
                afterSetExtremes: function (event) {
                    chartsList.forEach(otherChart => {
                    if(otherChart.xAxis[0].min != event.min || otherChart.xAxis[0].max != event.max) {
                        otherChart.xAxis[0].setExtremes(event.min, event.max)
                    }
                    })
                    
                }
            }
        })
    });
    }
}