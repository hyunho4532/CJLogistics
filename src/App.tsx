import { css } from '@emotion/css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { InfoCard } from './components/card/InfoCard';

function App() {
  const [map, setMap] = useState<any>();
  const [address, setAddress] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [locationDirections, setLocationDirections] = useState({
    location: [],
    popup: false
  }); 

  const [locationPosition, setLocationPosition] = useState<any[]>([]);

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

          setLocation([position.coords.latitude, position.coords.longitude]);

          const currentLocationMarker = new window.naver.maps.Marker({
            position: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
            map: map
          })

          axios.post("http://localhost:3000/reverse/geocode", { 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
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

  const addMarkerAtCenter = () => {
    if (!map) return;

    const markerElement = document.createElement('div');
    markerElement.className = css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(0%, 50%);
      width: 60px;
      height: 60px;
      background-image: url('public/marker.png');
      background-size: cover;
    `;

    document.body.appendChild(markerElement);

    window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
      const center = map.getCenter();
      setLocationPosition(center);
    });
  }

  const locationDirection = () => {
    axios.post('http://localhost:3000/direction/driving', {
      location: location,
      locationPosition: locationPosition
    })
      .then(response => {
        setLocationDirections({
          location: response.data.route.traoptimal[0].summary, 
          popup: true
        });
      })
  }

  return (
    <div className={css`
      text-align: center;
      margin: 0 auto;
    `}>
      <div className={css`
        margin-top: 160px;
      `}>
        <h2>아세테크 요금 계산기</h2>
        <button className={css`
          width: 160px;
          height: 40px;
          margin-left: 16px;
          background-color: #9999FF;
          border: 1px solid white;
          color: white;
        `} onClick={() => currentLocation()}>현재 위치 가져오기</button>
        
        <button className={css`
          width: 160px;
          height: 40px;
          margin-left: 16px;
          background-color: #9999FF;
          border: 1px solid white;
          color: white;
        `} onClick={() => addMarkerAtCenter()}>위치 지정하기</button>
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
        background-color: #9999FF;
        border: 1px solid white;
        color: white;
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

        { locationDirections.popup && 
          <InfoCard locationDirections={locationDirections} />
        }
      </div>
    </div>
  )
};

export default App;