function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function downloadAsCSV(data, fileTitle, customHeader) {
    var keys = Object.keys(data[0]);
    var headers = {};
    let headerVal = (customHeader && customHeader.length == keys.length) ? customHeader : keys;
    for (let i = 0; i < keys.length; i++) {
        headers[keys[i]] = headerVal[i];
    }

    var formattedJson = [];

    // format the data
    var tempData;
    data.forEach((item) => {
        tempData = {};
        for (let j = 0; j < keys.length; j++) {
            tempData[keys[j]] = item[keys[j]];
        }
        formattedJson.push(tempData);
    });



    exportCSVFile(headers, formattedJson, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}