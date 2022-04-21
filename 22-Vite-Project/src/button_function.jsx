import { Fragment, useState } from "react"
import {Toast, Button} from 'react-bootstrap'

function ButtonFunction () {
    const [count, setCount] = useState(0)

    const IncrementButton = () => {
        setCount(count + 1)
    }
    const DecrementButton = () => {
        setCount(count - 1)
    }

    return (
        <Fragment>

        <Toast>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">Button Event</strong>
                <small>click button to change number</small>
            </Toast.Header>
            <Toast.Body>
                <Button onClick={IncrementButton} variant="outline-success" gap={1}>Increase</Button>{' '}
                <Button onClick={DecrementButton} variant="outline-danger">Decrease</Button>
                <h5>Quantity : {count}</h5>
            </Toast.Body>
        </Toast>
    
        </Fragment>
    )
}

export default ButtonFunction