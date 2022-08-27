import React from 'react'

export default function SmallPieChart({ratio, color}) {

    return (
        <div className="pie"
        style={{
            ["--p"]: ratio,
            ["--c"]: "#033e8a",
        }}> {ratio}%
            <style jsx>{`
              .pie {
                --w: 50px;
                --b: 10px;

                width: var(--w);
                aspect-ratio: 1;
                position: relative;
                display: inline-grid;
                place-content: center;
                margin: 5px;
                font-size: 13px;
                font-weight: lighter;
                font-family: sans-serif;
              }

              .pie:before {
                content: "";
                position: absolute;
                border-radius: 50%;
                inset: 0;
                background: radial-gradient(farthest-side, var(--c) 98%, #0000) top/var(--b) var(--b) no-repeat,
                conic-gradient(var(--c) calc(var(--p) * 1%), #0000 0);
                -webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - var(--b)), #000 calc(100% - var(--b)));
                mask: radial-gradient(farthest-side, #0000 calc(99% - var(--b)), #000 calc(100% - var(--b)));
              }

              .pie:after {
                content: "";
                position: absolute;
                border-radius: 50%;
                inset: calc(50% - var(--b) / 2);
                background: var(--c);
                transform: rotate(calc(var(--p) * 3.6deg)) translateY(calc(50% - var(--w) / 2));
              }
            `}</style>
        </div>
    )
}