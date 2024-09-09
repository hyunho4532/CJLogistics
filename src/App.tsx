import { css } from '@emotion/css';
import { useEffect, useMemo, useRef } from 'react';

function App() {
  const mapRef = useRef(null);

  const initMap = useEffect(() => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    })

    initMap
  }, []);

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          
        }
      )
    }
  }


  return (
    <div className={css`
      text-align: center;
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
        `}>현재 위치 가져오기</button>
        
        <button className={css`
          width: 160px;
          height: 40px;
          margin-left: 16px;
        `}>위치 지정하기</button>

      </div>
      <div className={css`
        width: 1080px;
        height: 620px;
        margin: 0 auto;`} ref={mapRef} />
    </div>
  )
};

export default App;