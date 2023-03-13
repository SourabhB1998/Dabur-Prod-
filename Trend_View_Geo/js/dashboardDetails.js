var currentLocation = window.location.href;
var currentLocation = "https://dabur.digilytics.solutions/bim/api/v1/dashboard/3/report/43";
var matches = currentLocation.split("/");

var companyId = null;
var dashboardId = null;
for (let i = 0; i < matches.length; i++) {
    let element = matches[i];
    if (!isNaN(parseFloat(element))) {
        if (companyId == null) {
            companyId = element;
            continue;
        }
        if (dashboardId == null) {
            dashboardId = element;
            continue;
        }
    }
}
$("#companyId").val(companyId);
$("#dashboardId").val(dashboardId);
var instrumentationKey;
var userId;
var allowedEmailDomains;
var baseURL;
var chatURL;
var restBaseURL;
var dashboardFullName = "Strategic Overview : Trend View Geo Hierarchy";

$.ajax({
    type: "GET",
    url: getDashboardApiDomain(),
    success: (function (data) {
        instrumentationKey = data[0].instrumentationKey;
        allowedEmailDomains = data[0].allowedEmailDomains;
        baseURL = data[0].baseURL;
        chatURL = data[0].chatURL;
        restBaseURL = data[0].restBaseURL;
        userId = data[0].userId;
        applicationInsight();
    }),
    error: (function (err) {
        if (err.status == 404) {
            $(".mainContent").html("<p><h3  style='text-align: center; color: #e7875c;'>Server is down due to regular maintenance activities by our experts. Regret for inconvenience caused. Please access the dashboards again in a while ! </h3></p>");
        }
        console.log(err);
    })
});



function getDashboardApiDomain() {
    let host = window.location.host.toLowerCase();
    host = host.replace("www.", "");
    if (host == "" || host.indexOf('localhost') !== -1) {
        return "https://localhost:8087/bim/api/v1/dashboardEmbedDetails/dashboardInfo/54/32";
    }

    if (!companyId || companyId == '') {
        alert("Company Id is is required");
        return null;
    }
    return "https://" + host + "/bim/api/v1/" + companyId + "/dashboard-embed-details/dashboard-info/" + dashboardId;
}

function applicationInsight() {
    var userID = userId;

    var sdkInstance = "appInsightsSDK";
    window[sdkInstance] = "appInsights";
    var aiName = window[sdkInstance],
        aisdk = window[aiName] || function (e) {
            function n(e) {
                t[e] = function () {
                    var n = arguments;
                    t.queue.push(function () {
                        t.context.user.id = userID.toString();
                        t[e].apply(t, n)
                    })
                }
            }
            var t = { config: e };
            t.initialize = !0;
            var i = document,
                a = window;
            setTimeout(function () {
                var n = i.createElement("script");
                n.src = e.url || "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", i.getElementsByTagName("script")[0].parentNode.appendChild(n)
            });
            try { t.cookie = i.cookie } catch (e) { }
            t.queue = [], t.version = 2;
            for (var r = ["Event", "PageView", "Exception", "Trace", "DependencyData", "Metric", "PageViewPerformance"]; r.length;) n("track" + r.pop());
            n("startTrackPage"), n("stopTrackPage");
            var s = "Track" + r[0];
            if (n("start" + s), n("stop" + s), n("setAuthenticatedUserContext"), n("clearAuthenticatedUserContext"), n("flush"), !(!0 === e.disableExceptionTracking || e.extensionConfig && e.extensionConfig.ApplicationInsightsAnalytics && !0 === e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)) {
                n("_" + (r = "onerror"));
                var o = a[r];
                a[r] = function (e, n, i, a, s) { var c = o && o(e, n, i, a, s); return !0 !== c && t["_" + r]({ message: e, url: n, lineNumber: i, columnNumber: a, error: s }), c }, e.autoExceptionInstrumented = !0
            }
            return t
        }({
            instrumentationKey: instrumentationKey,
            autoTrackPageVisitTime: true
        });
    window[aiName] = aisdk, aisdk.queue && 0 === aisdk.queue.length && aisdk.trackPageView({});
}

function trackCustomEvent(eventName, payload) {
    // window.appInsights.trackEvent({name:"Full Screen Event Clicked"}, {"companyId":companyId.toString(),"userId":userId.toString(),"dashboardId":dashboardId.toString(),"reportName":reportTitle.toString(),"pageName":currentPageName.toString()});
    window.appInsights.trackEvent({ name: eventName }, payload);
}

function trackCustomPageLoadEvent(eventName, payload) {
    // window.appInsights.trackEvent({name:"Full Screen Event Clicked"}, {"companyId":companyId.toString(),"userId":userId.toString(),"dashboardId":dashboardId.toString(),"reportName":reportTitle.toString(),"pageName":currentPageName.toString()});
    window.appInsights.trackEvent({ name: eventName }, payload);
}