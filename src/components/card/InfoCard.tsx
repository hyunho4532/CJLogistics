import { css } from "@emotion/css"
import { comma, meterToKm, millisecondToHHMMSS } from "../../ui-kit";

export type Props = {
    locationDirections: {
        location: never[],
        popup: boolean
    }
}

export function InfoCard({ locationDirections }: Props) {
    return (
        <div className={css`
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: white;
            width: 360px;
            height: 200px;
            border-radius: 32px;
          `}>
            <p>🛂: {comma(locationDirections.location.tollFare)}원</p>
            <p>⛽: {comma(locationDirections.location.fuelPrice)}원</p>
            <p>🚕: {comma(locationDirections.location.taxiFare)}원</p>
            <p>🚗: {meterToKm(locationDirections.location.distance)}km</p>
            <p>🕐: {millisecondToHHMMSS(locationDirections.location.duration)}</p>
          </div>
    )
}