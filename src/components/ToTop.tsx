import * as React from 'react'
import styled, { css } from 'styled-components'

const iconPublic = `
    fill:none;
    stroke-linecap:round;
    stroke-linejoin:round;
    stroke-width:48px;
`
const ToTop = styled.button`
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
    background: #fff;
    outline: none;
    border: none;
    transition: 0.5s all;
    ${(props: { hide: boolean }) => props.hide && css`
        bottom: -50px;
        polyline {
            stroke: none;
            ${iconPublic}
        }
    `}
    polyline {
        stroke:#000;
        ${iconPublic}
    }
    &: hover{
        background: #dcc9c9;
    }
`

declare global {
    interface Window {
        toTop: any;
    }
}

export default () => {
    const [isHide, setHide] = React.useState(true)
    React.useEffect(() => {
        const cb = () => {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t <= 148) {
                setHide(true)
            } else {
                setHide(false)
            }
        }
        window.addEventListener("scroll", cb.bind(this))
        return () => { window.removeEventListener("scroll", cb.bind(this)) }
    }, [])
    return (
        <ToTop
            hide={isHide}
            onClick={() => {
                if (document.documentElement.scrollTop) {
                    window.toTop = setInterval(() => {
                        if (document.documentElement.scrollTop === 0) clearInterval(window.toTop)
                        document.documentElement.scrollTop -= 200
                    }, 40);
                } else {
                    window.history.pushState(null, '', '#')//兼容
                }
            }}
            className="card"
        >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'>
                <title>ionicons-v5-a</title>
                <polyline points='112 328 256 184 400 328' />
            </svg>
        </ToTop>
    )
}
