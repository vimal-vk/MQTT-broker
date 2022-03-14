var host = prompt('Enter a host address')
console.log(host)

const properties = ['publish', 'subscribe']
var active = "publish"
var passive = "subscribe"
//const options = ["user", "port", "host", "message", "repeat", "repeat-delay"]
//const totalOptions = [["username", "password"], ["portno"], ["hostname"], ["messagebox"], ["repeatno"], ["repeatdelay"]]
var messages = []
var client = new Paho.MQTT.Client(host, Number(9001), "clientId_"+Math.floor(Math.random()*100));
client.onConnectionLost = onConnectionLost
client.onMessageArrived = onMessageArrived
client.connect({ onSuccess: ()=>{
  console.log("connected")
}})

function changeActive(item) {
  active = item.id;
  passive = properties[0]
  document.getElementsByTagName("button")[0].innerText=active
  if (properties[0] == active) {
    passive=properties[1]
  }
  document.getElementById('active-bar').classList.replace("active-" + passive,"active-" + active)
  if(active=="subscribe"){
    if(document.getElementsByClassName("extra")[0]){
      //for(var i=0;i<3;i++){
      document.getElementsByClassName("extra")[0].classList.replace("extra","none")
    }
    document.getElementById("topic-container").classList.remove("none")
  }
  else{
    if(document.getElementsByClassName("none")[0]){
      for(var i=0;i<3;i++){
        document.getElementsByClassName("none")[0].classList.replace("none","extra")
      }
    }
    document.getElementById("topic-container").classList.add("none")
  }
}

function optionsClick(option) {
  var optionchange = document.getElementById(option.id + "options")
  if (option.checked == true) {
    optionchange.style.display = "block"
  }
  else {
    optionchange.style.display = "none"
  }
}

function newAction(){
  var topic = document.getElementsByName("topicname")[0].value
  if(active=="publish"){
    newPublish(topic);
  }
  else{
    newSubscribe(topic);
  }
}

function newSubscribe(topic){
  console.log('subscribe success')
  client.subscribe(topic)
}

function newPublish(topic){
  console.log('publish success')
  var checkbox = document.getElementById("message")
  if(checkbox.checked==true){
    var msgvalue = document.getElementsByName("messagebox")[0].value
    var message = new Paho.MQTT.Message(msgvalue);
    message.destinationName = topic;
    client.send(message);
  }
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
  console.log("onConnectionLost:"+responseObject.errorMessage);
}

function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  messages.push(message.payloadString)
  callForDisplay();
}

function callForDisplay(){
  if(active=="subscribe"){
    var div = document.getElementById("topic-container")
    //console.log(div,messages[messages.length-1])
    var p = document.createElement('h3')
    p.innerHTML=messages[messages.length-1]
    div.appendChild(p)
  }
}

// https://www.thomaslaurenson.com/blog/2018-07-10/mqtt-web-app-using-javascript-and-websockets/