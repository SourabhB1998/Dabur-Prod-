//shared data Metrices
let potentialStateShareValues;
let penetraStateShareValues;
let saleStateShareValues;
let retStateShareValues;
let skuStateShareValues;

//STATE VIEW KPI Matrix
var statepotentialReqObj;
function statepotentialDataFromApi() {
    if (statepotentialReqObj) {
        statepotentialReqObj.abort();
        statepotentialReqObj = null;
    }


    let statefilterdata = createStateFilterData();
    potentialStateShareValues = null;
    statepotentialReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Key_Metrics_Potential_V2", 'chartDataForms': statefilterdata }),
        success: (function (resultData) {
            let potentialData = resultData.data.data[0];
            potentialStateShareValues = potentialData;
            statepotentialReqObj = null;

            $("#satPoteId td").remove();
            $("#satPoteId td").empty();
            if (potentialData.length != 0) {
                $("#satPoteId").append("<td class='metricsValue'>" + numberFormatter(potentialData[0].CY_Potential, prefixSymbol = '') + " </td>");
                $("#satPoteId").append("<td class='metricsValue'>" + numberFormatter(potentialData[0].PY_Potential, prefixSymbol = '') + " </td>");
                $("#satPoteId").append("<td class=" + addClassColor(potentialData[0].YoY_Potential) + ">" + numberAvgFormatter(potentialData[0].YoY_Potential, prefixSymbol = '') + "%</td>");
            } else {
                $("#satPoteId").append("<td class='metricsValue'> 0 </td>");
            }
            statepenetrationDataFromApi();
            potentialData = null;

        }),
        error: (function (err) {
            statepotentialReqObj = null;
            console.log(err);
        })
    });
}

var statesalesReqObj;
function statesalesDataFromApi() {
    if (statesalesReqObj) {
        statesalesReqObj.abort();
        statesalesReqObj = null;
    }
    let allStateFilterData = createStateFilterData();
    saleStateShareValues = null;
    statesalesReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Key_Metrics_Dealer_Sales_V2", 'chartDataForms': allStateFilterData }),
        success: (function (resultData) {
            let salesData = resultData.data.data[0];
            saleStateShareValues = salesData
            $("#satSalesId td").remove();
            $("#satSalesIdtd").empty();
            if (salesData.length != 0) {
                $("#satSalesId").append("<td class='metricsValue'>" + numberFormatter(salesData[0].CY_Sales, prefixSymbol = '') + " </td>");
                $("#satSalesId").append("<td class='metricsValue'>" + numberFormatter(salesData[0].PY_Sales, prefixSymbol = '') + " </td>");
                $("#satSalesId").append("<td class=" + addClassColor(salesData[0].YoY_Sales) + ">" + numberAvgFormatter(salesData[0].YoY_Sales, prefixSymbol = '') + "%</td>");
            } else {
                $("#satSalesId").append("<td class='metricsValue'> 0 </td>");
            }
            stateskuDataFromApi();
            salesData = null;
            statesalesReqObj = null;
        }),
        error: (function (err) {
            statesalesReqObj = null;
            console.log(err);
        })
    });
}


var statepenetrationReqObj;
function statepenetrationDataFromApi() {
    if (statepenetrationReqObj) {
        statepenetrationReqObj.abort();
        statepenetrationReqObj = null;
    }
    penetraStateShareValues = null;
    let statefilterdataPenetr = createStateFilterData();
    statepenetrationReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Key_Metrics_Penetration_V2", 'chartDataForms': statefilterdataPenetr }),
        success: (function (resultData) {
            let penetrationData = resultData.data.data[0];
            penetraStateShareValues = penetrationData;

            $("#satpenetId td").remove();
            $("#satpenetId td").empty();
            if (penetrationData != 0) {
                $("#satpenetId").append("<td class='metricsValue'>" + numberFormatter(penetrationData[0].CY_Penetration, prefixSymbol = '') + "%</td>");
                $("#satpenetId").append("<td class='metricsValue'>" + numberFormatter(penetrationData[0].PY_Penetration, prefixSymbol = '') + "%</td>");
                $("#satpenetId").append("<td class=" + addClassColor(penetrationData[0].YoY_Penetration) + ">" + numberAvgFormatter(penetrationData[0].YoY_Penetration, prefixSymbol = '') + "%</td>");
            } else {
                $("#satpenetId").append("<td class='metricsValue'> 0 </td>");
            }
            stateRetDataFromApi();
            statepenetrationReqObj = null;
            penetrationData = null;

        }),
        error: (function (err) {
            statepenetrationReqObj = null;
            console.log(err);
        })
    });
}



let retailerData;
var dealerReqObj;
function stateRetDataFromApi() {
    if (dealerReqObj) {
        dealerReqObj.abort();
        dealerReqObj = null;
    }
    retStateShareValues = null;
    let statefilterdataDealer = createStateFilterData();

    dealerReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Key_Metrics_Retailer_Count_V2", 'chartDataForms': statefilterdataDealer }),
        success: (function (resultData) {
            retailerData = resultData.data.data[0];
            retStateShareValues = retailerData;
            $("#satDealDisId td").remove();
            $("#satDealDisId td").empty();
            if (retailerData.length != 0) {
                $("#satDealDisId").append("<td class='metricsValue'>" + numberFormatter(retailerData[0].CY_Count, prefixSymbol = '') + "</td>");
                $("#satDealDisId").append("<td class='metricsValue'>" + numberFormatter(retailerData[0].PY_Count, prefixSymbol = '') + "</td>");
                $("#satDealDisId").append("<td class=" + addClassColor(retailerData[0].YoY_Count) + ">" + numberAvgFormatter(retailerData[0].YoY_Count, prefixSymbol = '') + "%</td>");
                $("#keyMetricsLoaderState").css('display', 'none');
            } else {
                $("#satDealDisId").append("<td class='metricsValue'> 0 </td>");
            }
            dealerReqObj = null;
            retailerData = null;


        }),
        error: (function (err) {
            dealerReqObj = null;
            console.log(err);
        })
    });
}


var skuReqObj;
function stateskuDataFromApi() {
    if (skuReqObj) {
        skuReqObj.abort();
        skuReqObj = null;
    }

    skuStateShareValues = null;
    let statefilterdataSku = createStateFilterData();
    skuReqObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Key_Metrics_SKU_Count_V2", 'chartDataForms': statefilterdataSku }),
        success: (function (resultData) {
            let skuData = resultData.data.data[0];
            skuStateShareValues = skuData;
            $("#satSkuId td").remove();
            $("#satSkuId td").empty();
            if (skuData.length != 0) {

                $("#satSkuId").append("<td class='metricsValue'>" + valueFormater(skuData[0].CY_Count, prefixSymbol = '') + " </td>");
                $("#satSkuId").append("<td class='metricsValue'>" + valueFormater(skuData[0].PY_Count, prefixSymbol = '') + " </td>");
                $("#satSkuId").append("<td class=" + addClassColor(skuData[0].YoY_Count) + ">" + valueFormater(skuData[0].YoY_Count, prefixSymbol = '') + "%</td>");
            } else {
                $("#satSkuId").append("<td class='metricsValue'> 0 </td>");
            }
            skuReqObj = null;
            skuData = null;
        }),
        error: (function (err) {
            skuReqObj = null;
            console.log(err);
        })
    });
}



let StatePotDataObj;
function statePotentialvsSalesChartApi() {
    if (StatePotDataObj) {
        StatePotDataObj.abort();
        StatePotDataObj = null;
    }

    let statefilterterritoryData = createStateFilterData();


    StatePotDataObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Territory_Dtls_V2", 'chartDataForms': statefilterterritoryData }),
        success: (function (resultData) {
            let territoryData = resultData.data.data[0];
            StatePotDataObj = null;
            if (territoryData.length <= 0) {
                showHideLoader("satPotvsSaleContain",false);
                $("#satPotvsSaleContain").append("<div class='noData'>No Data</div>");
                return;
            } else {
                StatePotentialvsSalesChart(territoryData);
            }


        }),
        error: (function (err) {
            StatePotDataObj = null;
            console.log(err);
        })
    });
}

//Categorywise Potential Data
let StateCatDataObj;
function statecategorychartFromApi() {

    if (StateCatDataObj) {
        StateCatDataObj.abort();
        StateCatDataObj = null;
    }
    let statecategoryData = createStateFilterData();
    StateCatDataObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Distributor_Dtls_V2", 'chartDataForms': statecategoryData }),
        success: (function (resultData) {
            let distributorData = resultData.data.data[0];
            StateCatDataObj = null;
            if (distributorData.length <= 0) {
                showHideLoader("satRetperform",false);
                $("#satRetperform").append("<div class='noData'>No Data</div>");
                return;
            } else {
                statecategorychart(distributorData);
            }
        }),
        error: (function (err) {
            StateCatDataObj = null;
            console.log(err);
        })
    });
}


//Categorywise Potential Data
let StateRetDataObj;
function stateretailerchartFromApi() {

    if (StateRetDataObj) {
        StateRetDataObj.abort();
        StateRetDataObj = null;
    }
    let stateretailerData = createStateFilterData();

    StateRetDataObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_Classification_Dtls_V2", 'chartDataForms': stateretailerData }),
        success: (function (resultData) {
            let retailerData = resultData.data.data[0];
            StateRetDataObj = null;
            if (retailerData.length <= 0) {
                showHideLoader("satcatPotenContainId",false);
                $("#satcatPotenContainId").append("<div class='noData'>No Data</div>");
                return;
            }
            StateRetailerChart(retailerData);


        }),
        error: (function (err) {
            StateRetDataObj = null;
            console.log(err);
        })
    });
}


let stateOverViewObj;
function stateOverViewchartFromApi() {

    if (stateOverViewObj) {
        stateOverViewObj.abort();
        stateOverViewObj = null;
    }
    let statecategoryData = createStateFilterData();


    stateOverViewObj = $.ajax({
        url: getApiDomain(),
        type: 'POST',
        data: JSON.stringify({ 'filter': "State_View_State_Dtls_V2", 'chartDataForms': statecategoryData }),
        success: (function (resultData) {
            let stateOverData = resultData.data.data[0];
            stateOverViewObj = null;
            if (stateOverData.length <= 0) {
                showHideLoader("satMapContain",false);
                $("#satMapContain").append("<div class='noData'>No Data</div>");
                return;
            } else {
                stateOverViewchart(stateOverData);
            }
        }),
        error: (function (err) {
            stateOverViewObj = null;
            console.log(err);
        })
    });
}

function stateOverViewchart(stateOverData) {
    var data = [];
    var dataSum = [];
    for (let i = 0; i < stateOverData.length; i++) {
        dataSum.push((stateOverData[i].State).toLowerCase(), parseInt(stateOverData[i].CY_Sales * 1));
        data.push(dataSum);
        dataSum = [];
    }
    // Create the chart
    showHideLoader("satMapContain", false);
    Highcharts.mapChart('satMapContain', {
        chart: {
            map: 'countries/in/custom/in-all-disputed'
        },

        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        mapNavigation: {
            enabled: false,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            align: 'right',
            verticalAlign: 'middle'
        },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {

                console.log(this)
                console.log(this.key)
                console.log(this.point.value)
                console.log(this.series.name)
                return this.key + " :<br>" + this.series.name + " :" + getnumFormatterRupe(this.point.value);
            },
        },
        series: [{
            data: data,
            name: 'Sales',
            showInLegend: false,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: ''
            }
        }]
    });


}

function StatePotentialvsSalesChart(territoryData) {

    //  console.log(territoryData)
    let territoryname = [];
    let salesData = [];
    let potentialData = [];
    let penetrationData = [];
    let gapData = [];
    showHideLoader("satPotvsSaleContain", false);
    for (let i = 0; i < territoryData.length; i++) {
        territoryname.push(territoryData[i].Distributor_Territory);
        gapData.push(parseInt(territoryData[i].GAP * 1));
        salesData.push(parseInt(territoryData[i].CY_Sales * 1));
        potentialData.push(parseInt(territoryData[i].CY_Potential * 1));
        penetrationData.push(parseInt(territoryData[i].CY_Penetration * 1));
    }
    let options = {
        chart: {
            type: 'bar',
            renderTo: 'satPotvsSaleContain',
            inverted: true

        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: territoryname,
            title: {
                text: null
            },
            min: 0,
            scrollbar: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                enabled: false
            },
        },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                var points = this.points;
                var pointsLength = points.length;
                var tooltipMarkup = pointsLength ? '<span style="font-size: 13px">Territory : ' + points[0].key + '</span><br/>' : '';
                var index;
                var y_value;
                for (index = 0; index < pointsLength; index++) {
                    if (points[index].point.target != undefined) {
                        y_value = points[index].point.target;
                    } else {
                        y_value = points[index].y;
                    }
                    tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b><i class="fa fa-inr" aria-hidden="true"></i>' + getnumFormatterRupe(y_value) + '</b><br/>';
                }
                return tooltipMarkup;
            },
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        legend: {
            reversed: true

        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Potential',
            color: '#118DFF',
            data: potentialData
        }, {
            name: 'Sales',
            color: '#E66C37',
            data: salesData
        }]
    };
    if (territoryname.length > 9) {
        options.xAxis.max = 9;
        options.xAxis.scrollbar.enabled = true;
    }
    let chart = new Highcharts.Chart(options);
}


function statecategorychart(distributorData) {
    //  console.log(distributorData) 
    let salesData = [];
    let distData = [];
    let browserData = [];
    showHideLoader("satRetperform", false);
    $(".loader").css('margin-top', '11vw');
    for (let i = 0; i < distributorData.length; i++) {
        salesData.push(parseInt(distributorData[i].CY_Sales * 1));
        distData.push(distributorData[i].Distributor);

    }

    for (let j = 0; j < salesData.length; j++) {
        browserData.push({
            name: distData[j],
            y: salesData[j]
        });
    }
    // Create the chart
    Highcharts.chart('satRetperform', {
        chart: {
            type: 'pie'
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 20
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            y: 30,
            navigation: {
                activeColor: '#3E576F',
                animation: true,
                arrowSize: 12,
                inactiveColor: '#CCC',
                style: {
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '9px'
                }, style: {
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '9px'
                }
            }
        },
        credits: {
            enabled: false
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                size: '20%',
                center: ['40%', '40%'],
                size: '80%',
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {

                console.log(this)
                console.log(this.series.name)
                console.log(this.key)
                console.log(this.percentage)
                return this.key + " : <br>" +
                    this.series.name + " : " + getnumFormatterRupe(this.y) + " (" + (this.percentage).toFixed(2) + "%" + ")";
            },
        },
        series: [{
            name: 'Primary Sales',
            data: browserData,
            size: '100%',
            innerSize: '50%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
            },

        }],

    });

}





function StateRetailerChart(retailerData) {
    //    console.log(retailerData) 
    let salesData = [];
    let classificationData = [];
    showHideLoader("satcatPotenContainId", false);
    // $(".loader").css('margin-top', '11vw');
    for (let i = 0; i < retailerData.length; i++) {
        salesData.push(parseInt(retailerData[i].CY_Sales * 1));
        classificationData.push(retailerData[i].Classification);

    }

    // Create the donut chart
    Highcharts.chart('satcatPotenContainId', {

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 20
        },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {

                console.log(this)
                //console.log(this.name)
                console.log(this.key)
                console.log(this.percentage)
                return this.key + " : <br>" +
                    "Potential : " + getnumFormatterRupe(this.y) + " (" + (this.percentage).toFixed(2) + "%" + ")";
            },
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                size: '20%',
                center: ['40%', '40%'],
                size: '80%',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.0f}% '
                }

            }
        },
        series: [{
            name: '',
            colorByPoint: true,
            innerSize: '50%',
            data: [{
                name: classificationData[0],
                y: salesData[0],
                sliced: false,
                selected: true
            }, {
                name: classificationData[1],
                y: salesData[1]
            }, {
                name: classificationData[2],
                y: salesData[2]
            }, {
                name: classificationData[3],
                y: salesData[3]
            }, {
                name: classificationData[4],
                y: salesData[4]
            }, {
                name: classificationData[5],
                y: salesData[5]

            }]
        }]

    });
}


function createStateFilterData() {
    allStateFilterData = [];
    let yearData = $("#yearFilter").val();
    let monthDataNum = $("#monthFilter").val();
    let stateData = $("#stateFilter").val();

    let categoryData = $("#partCategoryFilter").val();
    var notSelected = $("#partCategoryFilter").find('option').not(':selected');
    var arrayOfUnselected = notSelected.map(function () {
        return this.value;
    }).get();
    if (arrayOfUnselected == 0) {
        categoryData = "";
    }
    let territoryData = $("#territoryFilter").val();
    var notSelected1 = $("#territoryFilter").find('option').not(':selected');
    var arrayOfUnselectedTerry = notSelected1.map(function () {
        return this.value;
    }).get();
    if (arrayOfUnselectedTerry == 0) {
        territoryData = "";
    }
    let distributorData = '';
    if (idMeta != '') {
        distributorData = idMeta;
    } else {
        distributorData = $("#distributorFilter").val();
        if(distributorData.length > 1){
        var notSelected2 = $("#distributorFilter").find('option').not(':selected');
        var arrayOfUnselected = notSelected2.map(function () {
            return this.value;
        }).get();
        if (arrayOfUnselected == 0) {
            distributorData = "";
        }
      }
    }
    }
    let classifictionFilterData = $("#classifictionFilter").val();
    var notSelected3 = $("#classifictionFilter").find('option').not(':selected');
    var arrayOfUnselected = notSelected3.map(function () {
        return this.value;
    }).get();
    if (arrayOfUnselected == 0) {
        classifictionFilterData = "";
    }

    allStateFilterData.push({ dataType: "String", key: 'Year', value: yearData.toString() });
    allStateFilterData.push({ dataType: "String", key: 'Month', value: monthDataNum.toString() });
    allStateFilterData.push({ dataType: "String", key: 'State', value: stateData.toString() });
    allStateFilterData.push({ dataType: "String", key: 'PartCategory', value: categoryData.toString() });
    allStateFilterData.push({ dataType: "String", key: 'Territory', value: territoryData.toString() });
    allStateFilterData.push({ dataType: "String", key: 'DistributorID', value: distributorData.toString() });
    allStateFilterData.push({ dataType: "String", key: 'classification', value: classifictionFilterData.toString() });

    return allStateFilterData;
}



function sharedDataStateCalling() {
    //mahesh
    let report = "Diagnostic & Performance";
    let title = $(".reportTitle").val();
    let filterData = createDistFilterData();
    let command = {};
    command.displayName = "Table View";
    command.reportDisplayName = "Key_Metrics of " + title;
    command.filterData = filterData

    let sharePotential = "Potential," + sharedFormatter(potentialStateShareValues[0].CY_Potential) + "," + sharedFormatter(potentialStateShareValues[0].PY_Potential) + "," + sharedFormatter(potentialStateShareValues[0].YoY_Potential) + "%";
    let sharePenetration = "Penetration," + sharedFormatter(penetraStateShareValues[0].CY_Penetration) + "," + sharedFormatter(penetraStateShareValues[0].PY_Penetration) + "," + sharedFormatter(penetraStateShareValues[0].YoY_Penetration) + "%";
    let shareDealers = "Dealers Sales," + sharedFormatter(saleStateShareValues[0].CY_Sales) + "," + sharedFormatter(saleStateShareValues[0].PY_Sales) + "," + sharedFormatter(saleStateShareValues[0].YoY_Sales) + "%";
    let shareDisribute = "Retailers," + sharedFormatter(retStateShareValues[0].CY_Count) + "," + sharedFormatter(retStateShareValues[0].PY_Count) + "," + sharedFormatter(retStateShareValues[0].YoY_Count) + "%";
    let shareSku = "#SKU," + sharedFormatter(skuStateShareValues[0].CY_Count) + "," + sharedFormatter(skuStateShareValues[0].PY_Count) + "," + sharedFormatter(skuStateShareValues[0].YoY_Count) + "%";

    let sharedData = "Category,CY,LY,YOY Growth \n" + sharePotential + "\n" + sharePenetration + "\n" + shareDealers + "\n" + shareDisribute + "\n" + shareSku + "";

    shareDataApiObject = { report: report, command: command, title: title, sharedData: sharedData }
    trackCustomEvent('Share Data Pop up Open', {
        "companyId": companyId.toString(),
        "userId": userId.toString(),
        "dashboardId": dashboardId.toString(),
        "reportName": reportTitle.toString()
    });
    $('#myModal').modal('show');
}   