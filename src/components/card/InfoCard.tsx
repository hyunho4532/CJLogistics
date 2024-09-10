import { css } from "@emotion/css"

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
            height: 140px;
          `}>
            <p>🛂: {locationDirections.location.tollFare}원</p>
            <p>⛽: {locationDirections.location.fuelPrice}원</p>
            <p>🚕: {locationDirections.location.taxiFare}원</p>
          </div>
    )
}