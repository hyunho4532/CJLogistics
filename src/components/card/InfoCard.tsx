import { css } from "@emotion/css"
import { meterToKm, millisecondToHHMMSS } from "../../ui-kit";

export type Props = {
    locationDirections: {
        location: never[],
        popup: boolean
    }
}

export function InfoCard({ locationDirections }: Props) {

    console.log(locationDirections);

    return (
        <div className={css`
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: white;
            width: 360px;
            height: 200px;
          `}>
            <p>🛂: {locationDirections.location.tollFare}원</p>
            <p>⛽: {locationDirections.location.fuelPrice}원</p>
            <p>🚕: {locationDirections.location.taxiFare}원</p>
            <p>🚗: {meterToKm(locationDirections.location.distance)}km</p>
            <p>🕐: {millisecondToHHMMSS(locationDirections.location.duration)}</p>
          </div>
    )
}