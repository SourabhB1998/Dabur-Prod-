let osclerHost = window.location.host.toLowerCase();
//let osclerHost = "dabur.digilytics.solutions";  //for working Locally
Highcharts.setOptions({
    chart: {},
    credits: {
        enabled: false
    },
    exporting: {
        menuItemDefinitions: {
            createComment: {
                onclick: function (event) {
                    let filterData = getAllFiltersData();
                    companyId = companyId;
                    // let userId = $("#userId").val();
                    //let dashboardId = $("#dashboardId").val();
                    dashboardId = dashboardId;
                    let reportTitle = $(".reportTitle").text();

                    let command = {};
                    command.displayName = reportTitle;

                    command.reportDisplayName = this.renderTo.title;;
                    // command.id = reportId;
                    // command.pageName = "Geo-Hierarchy";
                    // command.pageDisplayName ="Geo-Hierarchy"
                    command.filterData = filterData
                    saveComment("report", command, this.renderTo.title);

                    // Call ajax
                },
                text: 'Create Comment'
            },
            shareData: {
                onclick: function () {
                    let shareReportTitle = $(".reportTitle").text();
                    //  let shareReportId = $("#reportId").val();
                    let shareReportId = dashboardId;
                    let shareFilterData = createIndFilterData();
                    let command = {};
                    command.displayName = this.renderTo.attributes[1].value;
                    command.reportDisplayName = shareReportTitle;
                    command.id = shareReportId;
                    // command.pageName = "Geo-Hierarchy";
                    // command.pageDisplayName ="Geo-Hierarchy"
                    command.filterData = shareFilterData
                    console.log("ShareDataMethod");
                    console.log(this.getCSV());


                    let headerString = "Performance over time- " + removeHTMLTags(this.axes[1].axisTitle.textStr) + "\n"

                    shareData("report", command, this.renderTo.attributes[1].value, headerString + this.getCSV())

                },
                text: 'Share Data'
            }
        },
        buttons: {
            contextButton: {
                menuItems: ['createComment', 'shareData']
            }
        }
    }
});

var commentDataApiObject = {};

function saveComment(report, command, title) {
    commentDataApiObject = { report: report, command: command, title: title }
    trackCustomEvent('Comment Submitted', {
        "companyId": companyId.toString(),
        "userId": userId.toString(),
        "dashboardId": dashboardId.toString(),
        // "reportName": reportTitle.toString()
        "reportName": dashboardFullName.toString()
    });
    $('#commentModal').modal('show');
}

function submitComment(commentDataApiObject, text) {
    trackCustomEvent('Comment Pop Up Open', {
        "companyId": companyId.toString(),
        "userId": userId.toString(),
        "dashboardId": dashboardId.toString(),
        //"reportName": reportTitle.toString()
        "reportName": dashboardFullName.toString()
    });
    if (text != '') {
        var myObject = new Object();
        myObject.reportId = commentDataApiObject.command.id;
        myObject.reportName = commentDataApiObject.command.reportDisplayName;
        myObject.pageName = $('#reportId').text();
        myObject.pageDisplayName = $('#reportId').text();
        myObject.visualType = "Charts";
        myObject.visualName = commentDataApiObject.title;
        myObject.dashboardId = dashboardId;
        myObject.comment = text;

        myObject.filterData = JSON.stringify(commentDataApiObject.command.filterData);
        var jsonData = JSON.stringify(myObject);

        $.ajax({
            type: "POST",
            url: "https://" + osclerHost + "/bim/api/v1/" + companyId + "/dashboard/comment",
            contentType: 'application/json',
            data: jsonData,
            cache: false,
            success: function (data) {
                try {
                    $('#commentModal').modal('hide');
                    commentDataApiObject = {}
                    if (data.data.id > 0) {
                        var html = '<div class="strippedDiv" style="word-wrap: break-word;padding-left:2px;">'
                        html += "<b><a id='comment-" + myObject.id + "' data='" + myObject.filterData + "' about='" + myObject.pageName + "' onclick='filterReportEvent(event);' style='cursor:pointer;font-size: 14px;background:transparent;'>" + myObject.comment + "</a></b>";
                        html += "<br/>";
                        html += "Chart Name: <span>" + myObject.reportName + "</span><br/>";
                        html += "Report Name: <span>" + myObject.pageDisplayName + "</span><br/>";
                        html += "Posted By <span>You, Just Now.</span>";
                        html += "<br/><br/><br/>";
                        html += '</div>';
                        $("#commentsDiv").prepend(html);
                        $("#commentModalInput").val("");
                        showSnackbar("Comment posted successfully");
                    } else {
                        window.alert("There is some error in the system. Please try again.");
                    }
                } catch (e) {
                    $('#commentModal').modal('hide');
                    commentDataApiObject = {}
                }
            },
            error: function (data) {
                $('#commentModal').modal('hide');
                commentDataApiObject = {}
                window.alert("There is some error in the system. Please try again.");
            }
        });
    }
}


var shareDataApiObject = {};

function shareData(report, command, title, sharedData) {
    shareDataApiObject = { report: report, command: command, title: title, sharedData: sharedData }
    trackCustomEvent('Share Data Pop up Open', {
        "companyId": companyId.toString(),
        "userId": userId.toString(),
        "dashboardId": dashboardId.toString(),
        //"reportName": reportTitle.toString()
        "reportName": dashboardFullName.toString()
    });
    $('#myModal').modal('show');
}

function shareDataApi(shareDataApiObject, text) {
    if (text != '') {
        var myObject = new Object();
        myObject.reportId = shareDataApiObject.command.id;
        myObject.reportName = shareDataApiObject.command.displayName;
        myObject.pageName = shareDataApiObject.command.pageDisplayName;
        myObject.pageDisplayName = shareDataApiObject.command.pageDisplayName;
        myObject.visualType = "Chart";
        myObject.visualName = shareDataApiObject.title;

        myObject.dashboardId = dashboardId;
        myObject.comment = text;
        myObject.data = shareDataApiObject.sharedData;
        var jsonData = JSON.stringify(myObject);
        trackCustomEvent('Share Data Submitted', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            //"reportName": reportTitle.toString()
            "reportName": dashboardFullName.toString()
        });
        $.ajax({
            type: "POST",
            url: "https://" + osclerHost + "/bim/api/v1/" + companyId + "/dashboard/shareData",
            contentType: 'application/json',
            data: jsonData,
            cache: false,
            success: function (data) {
                try {
                    $("#shareDataTextboxId").val('');
                    $('#myModal').modal('hide');
                    shareDataApiObject = {}
                    if (data.data.id > 0) {
                        showSnackbar("Note sent successfully")

                    } else {
                        window.alert("There is some error in the system. Please try again.");
                    }
                } catch (e) {
                    showSnackbar("There is some error in the system. Please try again.")
                    $('#myModal').modal('hide');
                    shareDataApiObject = {}
                }
            },

            error: function (data) {
                $('#myModal').modal('hide');
                shareDataApiObject = {}
                window.alert("There is some error in the system. Please try again.");
            }
        });

    }
}


var data2 = []

function getUserList() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "https://" + osclerHost + "/company-management/api/v1/" + companyId + "/company/users?page=1&size=1000",
        success: function (vdata) {
            try {
                for (i = 0, temp = vdata.data; i < temp.length; i++) {
                    temp[i].name = temp[i].name.trim();
                    data2.push(temp[i]);
                }
                console.log(data2);
                if (data2.data.id > 0) {
                    $.toaster({ priority: 'success', title: ' ', message: 'Note sent successfully' });
                    //alert("Note sent successfully");
                } else {
                    window.alert("There is some error in the system. Please try again.");
                }
            } catch (e) { }
        }
    });

}
setTimeout(() => {
    getUserList()
}, 2000)


setTimeout(() => {


    $("textarea.mention").mentionsInput({
        onDataRequest: function (mode, query, callback) {
            let tagData = data2;
            tagData = _.filter(tagData, function (item) {
                return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
            callback.call(this, tagData);
        }
    });



    $(".get-mentions").click(function (tagData) {
        $("#shareErrorMsg").html("");
        let vv = $(".mentions div");
        let mytxt = vv[0].innerText
        console.log('mytxt:::', mytxt);
        let textData;
        let wholeData;
        $("textarea.mention").mentionsInput("getMentions", function (tagData) {
            console.log(JSON.stringify(tagData));
            wholeData = tagData;
        });

        $("textarea.mention").mentionsInput("val", function (text) {
            console.log(text);
            textData = text;
        });

        for (let i = 0; i < wholeData.length; i++) {
            let addedName = wholeData[i]

            function isCherries(addedName) {
                return addedName.id == wholeData[i].id;
            }
            console.log(':::::::::::::::::::::::::::::;;', data2.find(isCherries));
            let enterdEmail = data2.find(isCherries);
            mytxt = mytxt.replace(wholeData[i].value, enterdEmail.email);
        }
        var emailString = mytxt.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        var emailArr = [];
        if (emailString != null) {
            emailArr = emailString;
        }

        let invalidEmail = [];
        for (let i = 0; i < emailArr.length && allowedDomainsArr.length > 0; i++) {
            if (allowedDomainsArr.indexOf(emailArr[i].split('@')[1].toLowerCase()) < 0) {
                invalidEmail.push(emailArr[i]);
            }
        }
        console.log(invalidEmail);
        if (invalidEmail.length != 0) {
            $("#shareErrorMsg").html("You can only send a message to people within your organization. Kindly remove the following Email ID's - <br>" + invalidEmail.toString());
            return false;
        }
        shareDataApi(shareDataApiObject, mytxt)
    });
}, 5000)


function filterReportEvent(event) {
    $("#reportContainer").css("width", $(window).width() - 15);
    document.getElementById("commentsContainer").style.display = "none";
    let filter = event.target.attributes.data["value"]
    let filterValueArray = JSON.parse(filter);
    try {
        defaultBrand = true;
    } catch { }
    setFiltersForData(filterValueArray, filter);
}

function getComments(pageNo) {
    $.ajax({
        url: "https://" + osclerHost + "/bim/api/v1/" + companyId + "/dashboard/" + dashboardId + "/comments?page=" + pageNo + "&sort=createdAt,desc",
        contentType: 'application/json',
        success: function (response) {
            if ($("#showMoreComments")) {
                $("#showMoreComments").remove();
            }
            let currentPage = response.pagination.currentPage;
            let totalPages = response.pagination.totalPages;
            let html = '';
            let data = response.data;
            for (i = 0; i < data.length; i++) {
                let postedByText = data[i].postedBy.id == userId ? 'You' : data[i].postedBy.name;
                html += '<div class="strippedDiv" style="word-wrap: break-word;padding-left:2px;">'
                html += "<b><a id='comment-" + data[i].id + "' data='" + data[i].filterData + "' name='" + data[i].slicerData + "' about='" + data[i].pageName + "' onclick='filterReportEvent(event)' style='cursor:pointer;font-size: 14px;background:transparent;'>" + data[i].comment + "</a></b>";
                html += "<br/>";
                html += "Chart Name: <span>" + data[i].reportName + "</span><br/>";
                html += "Report Name: <span>" + data[i].pageDisplayName + "</span><br/>";
                html += "Posted By <span>" + postedByText + "</span> at <span>" + dateTimeToCurrentTimezone(data[i].createdAtDate) + "</span>";
                html += "<br/>";
                html += "<br/>";
                html += "<br/>";
                html += '</div>';
            }
            if (totalPages > currentPage) {
                html += "<div class='strippedDiv' style='margin-bottom:7px;text-align: center;font-size: 14px;color: #23527c;cursor: pointer;text-decoration: underline;' id='showMoreComments' onclick='getComments(" + (currentPage + 1) + ")'>Show More</div>";
            }
            $("#commentsDiv").append(html);
        }
    });
}

function dateTimeToCurrentTimezone(millisec) {
    let d = new Date(millisec);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();;
}

setInterval(function () {
    // method to be executed;
    $(document.getElementById("chatbot-template").contentWindow.document.getElementsByClassName("bubble")).css('maxWidth', "850px");
}, 1000);

function toggleChatWidth() {
    trackCustomEvent('Ask Osler Maximized View Clicked', {
        "companyId": companyId.toString(),
        "userId": userId.toString(),
        "dashboardId": dashboardId.toString(),
        // "reportName": reportTitle.toString()
        "reportName": dashboardFullName.toString()
    });
    var maxHeight = $(window).height();
    var minWidth = $(window).width();
    if ($("#chatbot-template").css("width") == "360px") {
        $("#chatbot").css("height", maxHeight - 100);
        $("#chatbot-template").css("width", '185vh');
        $("#chatbot-template").css("height", maxHeight - 100);
    } else {
        $("#chatbot-template").css("width", "360px");
        $("#chatbot-template").css("height", "500px");
        $("#chatbot").css("height", "500px");
    }
    $("#chatbot-template").show("slide");
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();


    setInterval(function () {
        // method to be executed;
        $(document.getElementById("chatbot-template").contentWindow.document.
            getElementsByClassName("bubble")).css('maxWidth', "850px")
    }, 1000);

}

$(function () {
    currentPageName = "";
    allowedDomainsArr = [];
    ajaxBaseURL = $('#baseURL').val();
    restUrl = $('#restBaseURL').val();
    allowedDomainsString = $('#allowedEmailDomains').val();
    // allowedDomainsArr=allowedDomainsString.split(",").filter(function(x) { return x !=''; });


    // Append the comments & Chat is structure
    var htmlString = '<div id="commentsContainer" style="width: 250px;float: left;border: 4px solid rgb(0, 0, 0);display: block;position: absolute;top: 44px;right: 45px;background: #fff;">';
    htmlString += '<div style="width:100%;font-weight: bold;">';
    htmlString += 'Observations on the report:<br>';
    // htmlString+='<i class="fa fa-eraser" style="cursor: pointer;display:none"></i>';
    htmlString += '<a  style="color:red;margin-bottom:10px;float:right;font-size:12px;background:transparent;"> <i class="fa fa-eraser" >Reset all filters</i></a>';
    htmlString += '</div>';
    htmlString += '<div class="pscroller" id="commentsDiv" style="font-size: 10px;float:left;overflow-y: auto;height:485px; width:100%;"></div>';
    htmlString += '</div>';
    htmlString += '<div id="chatbot">';
    htmlString += '<iframe allow="microphone" id="chatbot-template" style="margin-right: 45px;padding:0px;"  src="https://' + osclerHost + '/bim/api/v1/' + companyId + '/dashboardEmbed/chatbot/' + dashboardId + '"></iframe>';
    htmlString += '<div id="chatbot-tab" style="margin-top: 291px;margin-right:-150px;position: absolute;">';
    htmlString += '<img onclick="javascript:toggleChatWidth();" style="cursor: pointer;width: 22px;padding-right: 8px;padding-top: 0px;" src="./images/maximize.png"/>Ask Osler';
    htmlString += '</div>';
    htmlString += '<div id="comment-tab" style="margin-top: 125px;position: absolute;">Observations</div>';
    htmlString += '</div>';
    htmlString += '<div class="modal fade" data-backdrop="static" id="commentModal" role="dialog"  data-keyboard="false">';
    htmlString += '<div class="modal-dialog">';
    htmlString += '<div class="modal-content">';
    htmlString += '<div class="modal-header">';
    htmlString += '<button style="position: absolute;right: 10px;"  class="close" data-dismiss="modal" type="button">&times;</button>';
    htmlString += '<h4 style="margin-top: 6px;" class="modal-title">Comment</h4>';
    htmlString += '</div>';
    htmlString += '<div class="modal-body">';
    htmlString += '<div class="form-group">';
    htmlString += '<label for="commentModalInput">Enter a comment:</label>';
    htmlString += '<input class="form-control" id="commentModalInput" placeholder="Please enter the text" required type="text">';
    htmlString += '</div>';
    htmlString += '<button class="btn btn-lg btn-outline-primary" id="commentModalSubmit" type="button">Submit</button>';
    htmlString += '</div></div></div></div>';
    htmlString += '<div id="snackbar" style="display:none;"></div>';
    htmlString += '<div class="modal fade" data-backdrop="static" id="myModal" role="dialog"  data-keyboard="false">';
    htmlString += '<div class="modal-dialog">';
    htmlString += '<div class="modal-content">';
    htmlString += '<div class="modal-header">';
    htmlString += '<button style="position: absolute;right: 10px;" class="close" data-dismiss="modal" type="button">&times;</button>';
    htmlString += '<h4 style="margin-top: 6px;" class="modal-title">Share Data</h4>';
    htmlString += '</div>';
    htmlString += '<div class="modal-body">';
    htmlString += '<div class="examples" style="width:100%" onload="vmyFunction()">';
    htmlString += '<textarea class="mention" id="shareDataTextboxId" placeholder="Please write your message in the box.';
    htmlString += 'Example : Abc@mail.bajaj Hi All, I am able to share the data. Thanks!" style="height:75px;"></textarea>';
    htmlString += '<a class="button get-mentions btn btn-lg btn-outline-primary">Submit</a>';
    htmlString += '</div>';
    htmlString += '<div id="shareErrorMsg" style="color:red;font-size:12px;"></div>';
    htmlString += '<div style="font-size: 10px;">';
    htmlString += 'Disclaimer : You can tag only the users having access to this solution and you can email any users within your organization.';
    htmlString += '</div></div></div></div></div>';

    $('body').append(htmlString);

    var maxHeight = $(window).height();
    var minWidth = $(window).width();
    $("#chatbot-template").hide("slide");
    $("#commentsContainer").hide("slide");
    $("#chatbot-tab").click(function () {
        document.getElementById("commentsContainer").style.display = "none";
        document.getElementById("chatbot-template").style.display == "block";
        trackCustomEvent('Ask Osler Clicked', {
            "companyId": companyId.toString(),
            "userId": userId.toString(),
            "dashboardId": dashboardId.toString(),
            // "reportName": reportTitle.toString()
            "reportName": dashboardFullName.toString()
        });
        $("#commentsContainer").hide();
        $("#chatbot-template").toggle("slide");

    });
    $("#comment-tab").click(function () {
        // document.getElementById("chatbot-template").style.display == "none";
        $("#chatbot-template").hide("slide");
        if (document.getElementById("commentsContainer").style.display == "none") {
            $("#commentsDiv").empty();
            $("#reportContainer").css("width", minWidth - 300);
            document.getElementById("commentsContainer").style.display = "block";
            getComments(1)
        } else {
            $("#reportContainer").css("width", minWidth - 15);
            document.getElementById("commentsContainer").style.display = "none";
        }

    });
    $("#reportContainer").css("width", minWidth - 50);
    getComments(1);
});

$(document).on('click', '#commentModalSubmit', function () {
    let comment = $("#commentModalInput").val();
    console.log($("#commentModalInput").val())
    if (comment != '') {
        submitComment(commentDataApiObject, comment)
    }
});

function showSnackbar(message) {
    $("#snackbar").text(message);
    $("#snackbar").show();
    setTimeout(function () { $("#snackbar").hide(); }, 3000);
}