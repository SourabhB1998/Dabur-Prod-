var companyId=document.getElementById("companyId").innerText;
var authToken=document.getElementById("authToken").innerText;
var userId=document.getElementById("userId").innerText;
var chatSecret=document.getElementById("chatSecret").innerText;
var chatToken=document.getElementById("chatToken").innerText;
var dashboardId = document.getElementById("dashboardId").innerText;

    const DigilyticsChartAttachment = props =>
        <div style={{ fontFamily: '\'Calibri\', \'Helvetica Neue\', Arial, sans-serif', margin: 0, textAlign: 'center' }}>
          <canvas id={ `${ props.idCount }` } height="250px"></canvas>
		  <div style={{border:0,padding:0,margin:10}}>
            <b>{`${props.title}`}</b>
            <br/>
            {`${props.subtitle}`}
          </div>
        </div>;

        const DigilyticsTableAttachment = props =>
                <div style={{ fontFamily: '\'Calibri\', \'Helvetica Neue\', Arial, sans-serif', margin: 0, textAlign: 'center' }}>
                  <div id={ `${ props.idCount }` } width="250px" height="250px" style={{ overflow: 'auto' }}></div>
        		  <div style={{border:0,padding:0,margin:10}}>
                    <b>{`${props.title}`}</b>
                    <br/>
                    {`${props.subtitle}`}
                  </div>
                </div>;

        const DigilyticsDashboardAttachment = props =>
                <div style={{ fontFamily: '\'Calibri\', \'Helvetica Neue\', Arial, sans-serif', margin: 0, textAlign: 'center' }}>
                  <iframe src={ `${ encodeURI(props.charturl) }` } width="250px" height="250px"></iframe>
        		  <div style={{border:0,padding:0,margin:10}}>
                    <a href={ `${ encodeURI(props.charturl) }` } target="_blank">{`${props.title}`}</a>
                    <br/>
                    {`${props.subtitle}`}
                  </div>
                </div>;
      (async function () {
        const { createStore, ReactWebChat,createCognitiveServicesWebSpeechPonyfillFactory } = window.WebChat;
        const store = createStore();
        const directLine=window.WebChat.createDirectLine({ secret: chatSecret}) ;
        const attachmentMiddleware = () => next => card => {
          switch (card.attachment.contentType) {
            case 'application/digilytics.card':
			    var tempId=encodeURI(card.attachment.content.Title+"_"+card.activity.id.split("|")[1]);

                // There can be three output types as a viusal - PowerBI Dahshboard,chart or a table

                if(card.attachment.content.ChartType=="dashboard"){
                    return <DigilyticsDashboardAttachment idCount={tempId} title={ card.attachment.content.Title } subtitle={ card.attachment.content.Subtitle }  charturl={ card.attachment.content.ChartURL } />;
                } else if(card.attachment.content.ChartType=="table"){
                    setTimeout(function(){  loadTable(tempId,card.attachment.content.ChartData); }, 100);
                    return <DigilyticsTableAttachment idCount={tempId} title={ card.attachment.content.Title } subtitle={ card.attachment.content.Subtitle }  />;
                } else{
                    let dataArray=new Array();
                    let sectionNameArray = new Array();
                    var obj = JSON.parse(card.attachment.content.ChartData);
                    for (var key in obj) {
                        dataArray.push(obj[key]);
                        sectionNameArray.push(key);
                    }
                    setTimeout(function(){  loadChart(tempId,sectionNameArray,dataArray,card.attachment.content.ChartType); }, 100);
                    return <DigilyticsChartAttachment idCount={tempId} title={ card.attachment.content.Title } subtitle={ card.attachment.content.Subtitle }  />;
                }
            default:
              return next(card);
          }
        };
//        const activityMiddleware = () => next => card => {
//                  console.log(card);
//                  if(card.activity.type=="message" && card.activity.text != undefined && card.activity.channelData.state =="sent"){
//                  console.log("MESSAGE SENT");
//                  }
//                  return next(card);
//                };


		let webSpeechPonyfillFactory;

        webSpeechPonyfillFactory = await window.WebChat.createCognitiveServicesBingSpeechPonyfillFactory({authorizationToken: chatToken });
        let userIDs=userId+ ":"+companyId;
        window.ReactDOM.render(
          <ReactWebChat
            userID={userIDs}
            username={authToken}
            attachmentMiddleware={ attachmentMiddleware }
            directLine={ directLine }
            store={ store }
            webSpeechPonyfillFactory={ webSpeechPonyfillFactory }
			uploadButton = {false}
          />,
          document.getElementById('webchat')
        );

       directLine.postActivity({
            from: { id: userIDs, name: authToken },
            type: 'event',
            text: 'WELCOME'
       }).subscribe(function (id) {
          console.log('"trigger requestWelcomeDialog" sent');
       });

       document.querySelector('#webchat > *').focus();

       var textBox = document.querySelectorAll('input[data-id="webchat-sendbox-input"]')[0];
       textBox.addEventListener("keyup", function(event) {
           // Number 13 is the "Enter" key on the keyboard
           if (event.keyCode === 13) {
               window.appInsights.trackEvent({name:"Chatbot Query Submitted"}, {"companyId":companyId.toString(),"userId":userId.toString(),"dashboardId":dashboardId.toString()});
         }
       });

      })().catch(err => console.error(err));


      function loadTable(tempId,data){
            var div = document.getElementById(tempId);
            // var data = 'heading1,heading2,heading3,heading4,heading5\nvalue1_1,value2_1,value3_1,value4_1,value5_1\nvalue1_2,value2_2,value3_2,value4_2,value5_2';
            var lines = data.split("\n"), output = [], i;
            /* HEADERS */
            output.push("<tr><th>"
                + lines[0].slice().split("|").join("</th><th>")
                + "</th></tr>");

            for (i = 1; i < lines.length; i++)
                output.push("<tr><td>"
                    + lines[i].slice().split("|").join("</td><td>")
                    + "</td></tr>");

            output = "<table><tbody>"
                        + output.join("") + "</tbody></table>";

            div.innerHTML = output;
      }


      function loadChart(tempId,sectionNameArray,dataArray,type){
              var ctx = document.getElementById(tempId);
              if(ctx.className !=null && ctx.className != ""){
                // This is to avoid already created charts
                return;
              }
              console.log("Chart is called"+tempId)
              var myChart = new Chart(ctx, {
                  type: type,
                  data: {
                      labels: sectionNameArray,
                      datasets: [{
                          data: dataArray,
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'
                          ],
                          borderColor: [
                              'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)'
                          ],
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  beginAtZero: true
                              }
                          }]
                      },
                      legend: {
                          display: false
                      }
                  }
              });
            }