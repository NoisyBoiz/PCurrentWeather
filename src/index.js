import React, {useEffect,useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Test(){
  let checkLoad = useRef(0);
  function getJSON(path, myData) {
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if (xhr.status === 200) {
              if(xhr.responseText!=="")
                myData(JSON.parse(xhr.responseText));
            }
            else {
              alert('Opp! Có vẻ như thành phố mà bạn tìm không có trong cơ sở dữ liệu!');
          }
        }
        };
        xhr.open('GET', path, true);
        xhr.send();
  }
  function getData(){
    let x = document.getElementsByName('cityName')[0].value;
    document.getElementsByName('cityName')[0].value='';
    getJSON("https://api.openweathermap.org/data/2.5/weather?q="+x+"&appid=3d4bcf8d07cc381c111dcaccf827c042", myData);
  }
  function getTime(){
    let d = new Date();
    let day;
    switch (d.getDay()) {
      case 0: day = "Sun" ;break;
      case 1: day = "Mon" ;break;
      case 2: day = "Tue" ;break;
      case 3: day = "Wed" ;break;
      case 4: day = "Thu" ;break;
      case 5: day = "Fri" ;break;
      default:  day = "Sat" ;
    }
    let date = d.toLocaleDateString();
    date = day +", " + date;
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let second = d.getSeconds();
    if(Number(hours)<10) hours = '0' + hours;
    if(Number(minutes)<10) minutes = '0' + minutes;
    if(Number(second)<10) second = '0' + second;
    let time = hours + ':' + minutes + ':' +second;
    document.getElementsByClassName('dateNow')[0].innerHTML = date;
    document.getElementsByClassName('timeNow')[0].innerHTML = time;
  }
  setInterval(()=>{getTime()},1000);
  
  function myData(data){
    getHumidity(data.main.humidity);
    getClouds(data.clouds.all);
    getCountryName(data.name+", "+data.sys.country);
    getTemperature(data.main.temp);
    getWeather(data.weather[0].description);
    getPressure(data.main.pressure);
    getVisibility(data.visibility);
    getWindSpeed(data.wind.speed);
    getWindDeg(data.wind.deg);
  }

  function getHumidity(n){
    document.getElementsByClassName('dataHumidity')[0].innerHTML = n+'%';
    document.getElementsByClassName('barCircleHumidity')[0].style.strokeDashoffset = 3*Math.PI*2*(1-n/100) + "vw";
  }

  function getClouds(n){
    document.getElementsByClassName('dataClouds')[0].innerHTML = n+'%';
    document.getElementsByClassName('barCircleClouds')[0].style.strokeDashoffset = 3*Math.PI*2*(1-n/100) + "vw";
  }

  function getCountryName(n){
    document.getElementsByClassName("countryName")[0].innerHTML= n;
  }

  function getTemperature(n){
    let temp = Math.round((n - 273.15)*10)/10;
    if(checkLoad.current < 1 ){
      checkLoad.current ++;
      changeBackground(temp);
    }
    else{
      getImgBackground(temp);
    }
    changeColor(temp);
    document.getElementsByClassName('dataTemperature')[0].innerHTML = temp;
  }

  function getWeather(n){
    document.getElementsByClassName('weather')[0].innerHTML = n;
  }

  function getPressure(n){
    document.getElementsByClassName('dataPressure')[0].innerHTML = n + " hPa";
  }

  function getVisibility(n){
    document.getElementsByClassName('dataVisibility')[0].innerHTML = n +" m";
  }

  function getWindSpeed(n){
    document.getElementsByClassName('dataWindSpeed')[0].innerHTML = n + " m/s";
  }

  function getWindDeg(n){
    document.getElementsByClassName('dataWindDeg')[0].innerHTML = n +" ˚";
  }

  function getImgBackground(n){
    document.getElementById("imgBackground").style.opacity = 0;
    setTimeout(()=>{
      changeBackground(n);
      setTimeout(()=>{
        document.getElementById("imgBackground").style.opacity = 1;
      },100);
    },500);
  }

  function changeBackground(n){
    if(n>=30) document.getElementById('imgBackground').src = "/photo/summer.jpg";
    if(n<30 && n>=20) document.getElementById('imgBackground').src = "/photo/spring.jpg";
    if(n<20 && n>=10) document.getElementById('imgBackground').src = "/photo/autumn.jpg";
    if(n<10) document.getElementById('imgBackground').src = "/photo/winter.jpg";
  }

  function changeColor(n){
    let color = ['#FF2D00','#00FF83','#00F3FF','#7C4EFF'];
    let x;
    if(n>=30) x=0;
    if(n<30 && n>=20) x=1;
    if(n<20 && n>=10) x=2;
    if(n<10) x=3;
    document.getElementsByClassName('barCircleHumidity')[0].style.stroke = color[x];
    document.getElementsByClassName('barCircleClouds')[0].style.stroke = color[x];
  }

  useEffect(()=>{
    getJSON("https://api.openweathermap.org/data/2.5/weather?q=ha noi&appid=3d4bcf8d07cc381c111dcaccf827c042", myData);
    getTime();
    document.getElementsByName('cityName')[0].addEventListener('keydown',(e)=>{
      if(document.getElementsByName('cityName')[0].value!==''){
        if(e.key==="Enter"){
          getData();
        }
      }
    })
  },[])

  return(
    <div>
      <div className='imgBackground'> <img src="./photo/white.jpg" alt="weather" className='imgBackground'id="imgBackground"/></div>
      <div className='mainBox'>
        <div className='mainBoxContainer'> 
          <div className='topBox'>
            <div className='searchBox'>
              <input type="text" name="cityName" placeholder='Tên thành phố' className='placeSearch' ></input>
              <button onClick={()=>{getData()}} className="buttonSearch" > <i className="fa-solid fa-magnifying-glass"></i> </button>
            </div>
          </div>
          
          <div className='content'>
            <div className='leftContent'>
                <div className='boxTime'>
                  <p className='timeNow'> --:--:-- </p>
                  <p className='dateNow'> --,--/--/---- </p> 
                </div>

              <div className='humidity'> 
                <div className='humidityContainer'>
                <svg xmlns="http://www.w3.org/2000/svg" className='circleHumidity'>
                    <circle cx="4vw" cy="4vw" r="3vw"  strokeWidth="1vw"  fill="transparent" className='fillCircle'  />
                    <circle cx="4vw" cy="4vw" r="3vw"  strokeWidth="0.8vw"  fill="transparent" className='barCircleHumidity'  />
                </svg>
                <p className='dataHumidity'> 100% </p>
                </div>
                <span> Độ ẩm </span>
              </div>
              <div className='clouds'> 
                <div className='cloudsContainer'>
                <svg xmlns="http://www.w3.org/2000/svg" className='circleClouds'>
                    <circle cx="4vw" cy="4vw" r="3vw"  strokeWidth="1vw"  fill="transparent" className='fillCircle'  />
                    <circle cx="4vw" cy="4vw" r="3vw"  strokeWidth="0.8vw"  fill="transparent" className='barCircleClouds'  />
                </svg>
                  <p className='dataClouds'> 100% </p>
                </div>
                <span> Mây </span>
              </div>
            </div>
            <div className='centerContent'>
              <p className='countryName'> ----, --</p>
              <div className='temperature'> <p className='dataTemperature'> -- </p> <span> ˚C </span> </div> 
              <p className='weather'> ---- </p>
            </div>
            <div className='rigthContent'>
              <div className='pressure'> <i className="fa-solid fa-gauge-high"></i> <span> <p>Áp suất</p> <p className='dataPressure'> -- hPa </p> </span>  </div>
              <div className='visibility'> <i className="fa-solid fa-eye"></i> <span> <p>Tầm nhìn</p>  <p className='dataVisibility'> -- m </p> </span> </div>
              <div className='windSpeed'> <i className="fa-solid fa-wind"></i> <span> <p>Tốc độ gió</p> <p className='dataWindSpeed'> -- m/s </p> </span> </div>
              <div className='windDeg'><i className="fa-solid fa-up-down-left-right"></i> <span><p>Hướng gió</p> <p className='dataWindDeg'> -- ˚ </p> </span> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Test/>);
