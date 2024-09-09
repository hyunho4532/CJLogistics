import { css } from '@emotion/css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [map, setMap] = useState();
  const [address, setAddress] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [locationDirections, setLocationDirections] = useState([]); 

  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    })

    setMap(map);
  }, []);

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocation([latitude, longitude]);

          const currentLocationMarker = new window.naver.maps.Marker({
            position: new naver.maps.LatLng(latitude, longitude),
            map: map
          })

          axios.post("http://localhost:3000/reverse/geocode", { 
            latitude: latitude,
            longitude: longitude
          })
            .then(response => {
              setAddress(
                response.data.results[0].region.area1.name +
                response.data.results[0].region.area2.name +
                response.data.results[0].land.name +
                response.data.results[0].land.number1);
          })
            .catch(error => {
              console.error('Error in reverse geocoding request:', error);
          });
        }
      )
    }
  }

  const locationDirection = () => {
    axios.post('http://localhost:3000/direction/driving', {
      location: location  
    })
      .then(response => {
        setLocationDirections(response.data.route.traoptimal[0].summary);
      })
  }

  return (
    <div className={css`
      text-align: center;
      margin: 0 auto;
    `}>
      <div className={css`
      `}>
        <h2>아세테크 요금 계산기</h2>
        <button className={css`
          width: 160px;
          height: 40px;
          margin-left: 16px;
        `} onClick={() => currentLocation()}>현재 위치 가져오기</button>
        
        <button className={css`
          width: 160px;
          height: 40px;
          margin-left: 16px;
        `}>위치 지정하기</button>
      </div>

      <p className={css`
          text-align: left;
      `}>현재 위치: {address}</p>

      <input className={css`
        width: 820px;
        height: 32px;
        padding-left: 8px;
      `} 
      type='text'
      placeholder="도착지 주소를 입력해주세요." />

      <button className={css`
        width: 242px;
        height: 36px;
        margin-left: 8px;
      `} onClick={() => locationDirection()}>
        정보 조회
      </button>

      <div className={css`
        position: relative;
        width: 1080px;
        height: 620px;
        margin: 30px auto 0 auto;
      `}>
        <div className={css`
          width: 100%;
          height: 100%;
        `} ref={mapRef} />

        <div className={css`
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: white;
          width: 240px;
          height: 80px;
        `}>
          <p>톨게이트: {locationDirections.tollFare}원</p>
          <p>택시 비용: {locationDirections.taxiFare}원</p>
        </div>
      </div>

      <div className={css`
        margin-bottom: 120px;
      `}>
        ddds
      </div>
    </div>
  )
};

export default App;