import { css } from '@emotion/css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { InfoCard } from './components/card/InfoCard';
import { createMarker } from './features';

function App() {
  const [map, setMap] = useState<any>();
  const [address, setAddress] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [startAddress, setStartAddress] = useState<any[]>([]);
  const [lastAddress, setLastAddress] = useState<any[]>([]);

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
    const markerElement = document.createElement('div');
    createMarker(markerElement);

    document.body.appendChild(markerElement);

    window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
      const center = map.getCenter();
      setLocationPosition(center);
    });
  }

  const locationDirection = () => {

    console.log(startAddress);

    if (startAddress != null) {
      axios.post('http://localhost:3000/map/geocode', {
        startAddress: startAddress
      })
        .then(response => {
          console.log(response.data);
        })
    } else {
      axios.post('http://localhost:3000/direction/driving', {
        location: location,
        locationPosition: locationPosition
      })
        .then(response => {
          const routePath = response.data.route.traoptimal[0].path.map((coord: any) => 
            new naver.maps.LatLng(coord[1], coord[0])
          );
  
          const polyline = new window.naver.maps.Polyline({
            map: map,
            path: routePath
          })
  
          setLocationDirections({
            location: response.data.route.traoptimal[0].summary, 
            popup: true
          });
        })
    }
  }

  const onChange = (e: any, key: string) => {
    switch(key) {
      case "startAddress": {
        setStartAddress(e.target.value);
        break;
      };
      case "lastAddress": {
        setLastAddress(e.target.value);
        break;
      };
    }
  }

  return (
    <div className={css`
      text-align: center;
      margin: 0 auto;
    `}>
      <div className={css`
        margin-top: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-items: center;
      `}>
        <h2>아세테크 요금 계산기</h2>
      </div>

      <p className={css`
          text-align: left;
          margin-top: 46px;
      `}>현재 위치: {address}</p>

      <div className={css`
        display: flex;  
      `}>
        <input className={css`
          width: 460px;
          height: 32px;
          padding-left: 8px;
        `} 
        type='text'
        placeholder="출발지 입력하세요."
        onChange={(addr) => onChange(addr, "startAddress")} />
      </div>

      <div className={css`
        display: flex;
      `}>
        <input className={css`
          width: 460px;
          height: 32px;
          padding-left: 8px;
          margin-top: 8px;
        `} 
          type='text'
          onChange={(addr) => onChange(addr, "lastAddress")}
          placeholder="도착지 입력하세요." />
      
        <button className={css`
            width: 242px;
            height: 36px;
            margin-left: 8px;
            margin-top: 8px;
            background-color: #9999FF;
            border: 1px solid white;
            color: white;
          `} onClick={() => locationDirection()}>
            정보 조회
        </button>
      </div>


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

        <button className={css`
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: white;
          margin-left: 180px;
          width: 160px;
          height: 40px;
          border-radius: 32px;
          font-weight: bold;
        `} onClick={() => currentLocation()}>현재 위치 가져오기</button>

        <button className={css`
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: white;
            width: 160px;
            height: 40px;
            border-radius: 32px;
            font-weight: bold;
        `} onClick={() => addMarkerAtCenter()}>위치 지정하기</button>

        { locationDirections.popup &&
          <InfoCard locationDirections={locationDirections} />
        }
      </div>
    </div>
  )
};

export default App;