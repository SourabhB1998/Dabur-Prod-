function getApiDomain() {

    let host = window.location.host.toLowerCase();
    host = host.replace("www.", "");
    if (host == "" || host.indexOf('localhost') !== -1) {
        // return "https://api-uat.digilytics.solutions/reporting-service/api/v1/110/chart/data?isRoleBased=true";
        // return "https://api-uat.digilytics.solutions/reporting-service/api/v1/249/chart/data?isRoleBased=true";
          return "https://api-dabur.digilytics.solutions/reporting-service/api/v1/3/chart/data?isRoleBased=true";
    }

    if (!companyId || companyId == '') {
        alert("Company Id is is required");
        return null;
    }
    return "https://" + host + "/reporting-service/api/v1/" + companyId + "/chart/data?isRoleBased=true";
}

$(document).on('click', '.fa-eraser', function () {
    filterData = [];
    preSelectedFilterArray = [];
    resetFilters = true;
    defaultBrand = true;
    filterSelected = [];
    lastChangedFilter = "";
    callYearMonthOptions();
});


function setFiltersForData(filterData, filter) {
    if (!filterData) {
        return;
    }
    defaultBrand = false;
    let filterDatakeys = Object.keys(filterData);
    let filterName;
    let valArr;
    let currentEle;
    preSelectedFilterArray = [];
    filterSelected = [];

    let filterValueArr = [];

    for (let i = 0; i < filterDatakeys.length; i++) {
        if (filterDatakeys[i].toLocaleLowerCase() == "year") {
            $("#yearFilter").val(filterData[filterDatakeys[i]].split(','));
        } else if (filterDatakeys[i].toString() == 'lastSelectedFilter') {
            storeSelectedFilter(filterData[filterDatakeys[i]].toString().split(','), filterDatakeys[i])

            // preSelectedFilterArray.push({
            //     filterName: filter_Name,
            //     filterValue: filterValue
            // });
        } else {
            if (filterDatakeys[i].toLocaleLowerCase() === "zone") {
                storeSelectedFilter(filterData[filterDatakeys[i]].toString().split(','), filterDatakeys[i])
            }
            filterValueArr.push({
                dataType: "String",
                key: filterDatakeys[i],
                value: filterData[filterDatakeys[i]].toString()
            });
        }

    }

    populateCommentFilters(filterValueArr);
}

function populateCommentFilters(commentFilterData) {
    filterData = commentFilterData;
    let year = '';
    $("#yearFilter option:selected").each(function () {
        var $this = $(this);
        if ($this.length) {
            var selText = $this.text();
            year += selText
        }
    });
    let month = $('#monthFilter').val();
    filterData.push({
        dataType: "String",
        key: "Year",
        value: year
    });
    $.ajax({
        url: getApiDomain(),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ //filter: "filter_Options_Dependency_V1",
            filter: "filter_Options_Dependency_V1_Test_Zone",
            'chartDataForms': filterData
        }),
        success: function (dataResult) {
            let data = dataResult.data.data;
            if (!defaultBrand) {
                $("#goButton").show();
            }
            {
                let filterElement = $("#yearFilter");
                let yearIndex = commentFilterData.findIndex(obj => obj.key == "Year");
                let monthIndex = commentFilterData.findIndex(obj => obj.key == "month");
                let filterName = commentFilterData[yearIndex].key;
                let seleMonth = commentFilterData[monthIndex].value.split(",");
                filterElement.data('options', $('#monthDependantComboId option').clone());
                // let selectedYear = '20' + commentFilterData[yearIndex].value.split("-").pop();
                let selectedYear = commentFilterData[yearIndex].value;
                var finalArr = filterElement.data('options').filter('[class="' + selectedYear + '"]');
                let html = "";
                let selected = '';
                $("#monthFilter").empty();
                for (i = 0; i < finalArr.length; i++) {
                    jQuery(finalArr[i]).removeAttr("class");
                    selected = ''
                    for (j = 0; j < seleMonth.length; j++) {
                        if (finalArr[i].value == seleMonth[j]) {
                            selected = 'selected';
                        }
                    }
                    html += "<option value='" + finalArr[i].value + "' " + selected + ">" + finalArr[i].text + "</option>"
                }
                $("#monthFilter").html(html);
            }
            let selected = '';
            //Region Select
            {
                $("#zoneFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "zone");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[0]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].zone)) {
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

            //STate Select 
            {
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
            let brandIndex = -1;
            {
                $("#brandFilter").empty();

                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "brand");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[2]; i < temp.length; i++) {
                    brandIndex = brandArr.findIndex(obj => obj.id == temp[i].id);
                    if (brandIndex == -1) {
                        brandArr.push({
                            brand_Id: temp[i].id,
                            brandName: temp[i].brand
                        });
                    }
                    let selected = '';
                    if (defaultBrand) {
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
            {
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
                    if (seleBrand.includes(temp[i].brand_id))
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
            {
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
            {
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
            {
                $("#stockistTypeFilter").empty();
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "stockisttype");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[6]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].stockisttype)) {
                        selected = 'selected';
                    }
                    if (defaultBrand) {
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
            {
                $("#categoryFilter").empty();
                //$("#categoryFilter").append("<option value= ''selected >All</option>")
                const getStateIndex = preSelectedFilterArray.findIndex(obj => obj.filterName == "Category");
                let getStateFilterValue = getStateIndex != -1 ? preSelectedFilterArray[getStateIndex].filterValue : '';
                for (let i = 0, temp = data[8]; i < temp.length; i++) {
                    let selected = '';
                    if (getStateIndex == -1 && getStateFilterValue == '') {
                        selected = 'selected';
                    } else if (getStateFilterValue.includes(temp[i].Category)) {
                        selected = 'selected';
                    }

                    if (temp[i].Category == "Real Juices & Nectars" && defaultBrand) {
                        selected = "selected";
                    }
                    $("#categoryFilter").append("<option value='" + temp[i].Category + "' " + selected + ">" + temp[i].Category + "</option>")
                }
                $("#categoryFilter").multiselect('destroy');
                $('#categoryFilter').multiselect({
                    allSelectedText: 'All',
                    numberDisplayed: 1,
                    nonSelectedText: 'All',
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    minWidth: 100
                });

            }
            yearMonthObjAPi();
            global_initialFilterData = getAllFiltersData();
            filterSelected = [];
            defaultBrand = false;


        },
        error: function (err) {
            if (err.status == 404) {
                $(".mainContent").html("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");
            }
            console.log(err);
        }
    });

}

var global_initialFilterData;
function resetAllFilters() {

    setFiltersForData(global_initialFilterData);
}

function getAllFiltersData() {
    let filterDataObj = {};
    // $(".filter").each(function () {
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
        }
        filterDataObj[filterName] = filterValue.toString();
        // }
    }

    if (filterSelected.length > 0) {
        filterDataObj['lastSelectedFilter'] = filterSelected[filterSelected.length - 1].name;
    } else {
        filterDataObj['lastSelectedFilter'] = "";
    }

    filterDataObj['Year'] = $("#yearFilter").val();
    filterDataObj['month'] = $("#monthFilter").val()
    return filterDataObj;

}

var global_debounceTime = 2000;
const debounce = (func, delay) => {
    let debounceTimer
    return function () {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer
            = setTimeout(() => func.apply(context, args), delay)
    }
}


getLastRefreshedDate(); //ON LOAD CALL
function getLastRefreshedDate() {

    $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "Latest_Billdate" }),
        success: (function (resultData) {
            let dateString = resultData.data.data[0];
            var parts = dateString[0].billdate.split('-');
            if (parts.length != 3) {
                $("#lastRefreshedDateId").text(dateString);
                return;
            }
            var displayDate = parts[2] + "/" + parts[1] + "/" + parts[0];
            $("#lastRefreshedDateId").text(displayDate);
        }),
        error: (function (err) {
            console.log(err);
        })
    });
}