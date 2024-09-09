import { css } from '@emotion/css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [map, setMap] = useState();
  const [address, setAddress] = useState();
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

          const currentLocationMarker = new window.naver.maps.Marker({
            position: new naver.maps.LatLng(latitude, longitude),
            map: map
          })

          axios.post("http://localhost:3000/reverse/geocode", { 
            latitude: latitude,
            longitude: longitude
          })
            .then(response => {
              console.log(response.data.results[0])

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



  return (
    <div className={css`
      text-align: center;
      margin: 0 auto;
    `}>
      <div className={css`
        display: flex;
        align-items: center;
        justify-content: center;
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
      `}>{address}</p>

      <div className={css`
        width: 1080px;
        height: 620px;
        margin: 0 auto;`} ref={mapRef} />
    </div>
  )
};

export default App;