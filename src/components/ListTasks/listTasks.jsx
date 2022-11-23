import React, { useContext } from 'react'
import { AppContext } from '../../context/context';
import { useCollectionData } from 'react-firebase-hooks/firestore'

import './listTasks.less'

export const ListTasks = () => {
    const { ref } = useContext(AppContext)

    const [tasks, loading] = useCollectionData(
        ref.orderBy('date')
    )
    if (loading) {
        return (
            <h2>Loading...</h2>
        )
    }
    const handleClickDelete = async (task) => {
        ref.doc(`${task.id}`).delete()
    }

    return (
        <div className='container'>
            <ul className='tasks'>
                {tasks.map((task) => {
                    return (
                        <li className='tasks__list' key={task.id}>
                            <div className='tasks__leftBlock'>
                                <h2 className='tasks__leftBlock_title'>{task.title}</h2>
                                <p className='tasks__leftBlock_description'>{task.description}</p>
                            </div>
                            <div className='tasks__rightBlock'>
                                <input className='tasks__rightBlock_date' type='date' value={task.date} />
                                <a className='tasks__rightBlock_download'>Скачать Файл</a>
                                <div className='tasks__blockBtn'>
                                    <button className='tasks__blockBtn_btn'>Изменить</button>
                                    <button className='tasks__blockBtn_btn'>Отметить</button>
                                    <button className='tasks__blockBtn_btn' onClick={() => handleClickDelete(task)}>Удалить</button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}