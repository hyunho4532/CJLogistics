import { css } from "@emotion/css";

export const createMarker = (markerElement: HTMLDivElement) => {
    return markerElement.className = css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-60%, 300%);
        width: 60px;
        height: 60px;
        background-image: url('public/marker.png');
        background-size: cover;
    `;
}