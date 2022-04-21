import React from 'react'

const list = [{ data: 'item1'}, { data: 'item2'}, { data: 'item3'}]

export default function Contact() {
    const listData = list.map((item) => {
        return <p>{item.data}</p>
    })

    return (
        <div>
            <p>{listData}</p>
        </div>
    ) 
    
    
}