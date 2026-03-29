var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"guestId":"3081f355-debd-4588-a8f3-e5d3950c43f8","applicationId":"bb156aa2-5590-4099-beba-c80d160dbe25","message":"asdasda","attendance":"MAYBE"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

async function start(){
    for(let i=0;i<100;i++){
    try {
        const res = await fetch("http://localhost:5000/api/wishes", requestOptions)
        const data = await res.text();
        console.log(i+" "+data);
    } catch (error) {
        console.log(error);
    }
}

}

start();