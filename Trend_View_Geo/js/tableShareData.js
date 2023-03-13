function createIndFilterData() {
    let filterDataObj = {};
    let yearData = $("#yearFilter").val();
    let monthDataNum = $("#monthFilter").val();
    filterDataObj['yearFilter'] = yearData.toString();
    filterDataObj['monthFilter'] = monthDataNum.toString();
    for (let i = 0; i < preSelectedFilterArray.length; i++) {
        filterDataObj[preSelectedFilterArray[i].filterName] = (preSelectedFilterArray[i].filterValue).toString();
    }
    // filterDataObj["stateMeta"] = stateMeta.toString();
    // filterDataObj["idMeta"] = idMeta.toString();
    return filterDataObj;

}

function createCommentDataCalling() {
    let report = "Diagnostic & Performance";
    let title = $(".reportTitle").text();
    let tableName = ($(".tableName").text()).trim();
    let filterData = getAllFiltersData();
    let command = {};
    command.displayName = "Key Metrics";
    command.reportDisplayName = "Key Metrics";
    command.filterData = filterData
    commentDataApiObject = { report: report, command: command, title: title }
    if (userId != undefined) {

        trackCustomEvent('Comment Submitted', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": title.toString()
        });
    }
    $('#commentModal').modal('show');
}

function createCommentTableDataCalling() {
    let report = "Diagnostic & Performance";
    let title = $(".reportTitle").text();
    let filterData = getAllFiltersData().toString();
    let command = {};
    command.displayName = "Table View";
    command.reportDisplayName = "Table View";
    command.filterData = filterData
    commentDataApiObject = { report: report, command: command, title: title }

    if (userId != undefined) {

        trackCustomEvent('Comment Submitted', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": title.toString()
        });
    }
    $('#commentModal').modal('show');
}

function sharedDataKeyMetricsCalling() {
    let report = $(".reportNameId").text();
    let title = report + " " + $(".reportSubTitle").text();
    let filterData = createIndFilterData().toString();
    let command = {};
    command.displayName = "Table View";
    command.reportDisplayName = "Key Metrics for " + title;
    command.filterData = filterData

    let bodyString = ''

    let totalValues = totalvaluesShareData
    ecoValueShareData
    totalBillsValueShareData
    averageSalesShareData

    bodyString += sharedFormatter(totalValues[0].Sales) + "," + sharedFormatter(totalValues[0].Spend) + "," + sharedFormatter(totalValues[0].SpendSales) + "," + sharedFormatter(ecoValueShareData) + "," + sharedFormatter(totalBillsValueShareData) + "," + sharedFormatter(averageSalesShareData);

    let headerString = "Key Metrics\nTotal Sales(PTS),Total Spend,Spend/Sales(%),ECO,#Bills,Avg sales/Bills(PTR)\n";

    let sharedData = headerString + bodyString;

    shareDataApiObject = { report: report, command: command, title: title, sharedData: sharedData }
    if (userId) {
        trackCustomEvent('Share Data Pop up Open', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            "reportName": title.toString()
        });
    }
    $('#myModal').modal('show');
}