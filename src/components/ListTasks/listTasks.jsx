import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/context';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import './listTasks.less'

export const ListTasks = () => {
    const { firestore, firestorage } = useContext(AppContext)
    const [change, setChange] = useState();
    const [titleValue, setTitleValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [dateValue, setDateValue] = useState('')
    const [url, setUrl] = useState('')

    const [tasks, loading] = useCollectionData(
        firestore.orderBy('completed')
    )
    if (loading) {
        return (
            <h2 className='loading'>Loading...</h2>
        )
    }
    const handleClickDelete = async (task, id, file) => {
        deleteObject(ref(firestorage, `todoFile/${id + '_' + file}`)).then(() => {
        })
            .catch((error) => {
                console.log('delete error', error)
            });
        firestore
            .doc(`${task.id}`)
            .delete()

    }
    const handleClickChange = (id, title, description, date) => {
        setChange(id);
        setTitleValue(title);
        setDescriptionValue(description)
        setDateValue(date)
    }

    const handleClickSave = (id, titleValue, descriptionValue, dateValue) => {
        setChange(false)
        firestore
            .doc(`${id}`)
            .update({
                id: id,
                title: titleValue,
                description: descriptionValue,
                date: dateValue,
                completed: false,
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    const handleClickCompleted = (id, completed) => {
        firestore
            .doc(`${id}`)
            .update({
                completed: !completed,
            })
            .catch((err) => {
                console.log('err', err)
            })
    }
    const downloadClick = (id, file) => {
        getDownloadURL(ref(firestorage, `todoFile/${id + '_' + file}`))
            .then((url) => {
                setUrl(url)
            })
    }

    return (
        <div className='container'>
            <ul className='tasks'>
                {tasks.map((task) => {
                    const { id, title, description, date, completed, file } = task;
                    return (
                        <li className={completed ? 'tasks__list completed' : ' tasks__list' && date <= new Date().toISOString().slice(0, 10) ? 'tasks__list warning' : 'tasks__list'} key={id}>
                            {change === id ?
                                <div className='tasks__leftBlock'>
                                    <input
                                        className='tasks__leftBlock_inputTitle'
                                        type='text'
                                        value={titleValue}
                                        onChange={(e) => setTitleValue(e.target.value)}
                                    />
                                    <textarea
                                        className='tasks__leftBlock_inputDescription'
                                        type='textarea'
                                        rows={2}
                                        maxLength={200}
                                        value={descriptionValue}
                                        onChange={(e) => setDescriptionValue(e.target.value)}
                                    />
                                </div>
                                :
                                <div className='tasks__leftBlock'>
                                    <h2 className='tasks__leftBlock_title'>{title}</h2>
                                    <p className='tasks__leftBlock_description'>{description}</p>
                                </div>
                            }
                            {change === id ?
                                <div className='tasks__rightBlock'>
                                    <input
                                        className='tasks__rightBlock_date'
                                        type='date'
                                        value={dateValue}
                                        onChange={(e) => setDateValue(e.target.value)}
                                    />
                                    <div className='tasks__blockBtn'>
                                        <button className='tasks__blockBtn_btn' onClick={() => handleClickSave(id, titleValue, descriptionValue, dateValue)}>Сохранить</button>
                                    </div>
                                </div>
                                :
                                <div className='tasks__rightBlock'>
                                    <span className='tasks__rightBlock_date'>{date.split("-").reverse().join(".")}</span>
                                    {file === '' ? ''
                                        :
                                        <a className='tasks__rightBlock_download' href={url} onClick={() => downloadClick(id, file)} download={file}>Скачать Файл</a>
                                    }

                                    <div className='tasks__blockBtn'>
                                        <button className='tasks__blockBtn_btn' onClick={() => handleClickChange(id, title, description, date)}>Изменить</button>
                                        <button className='tasks__blockBtn_btn' onClick={() => handleClickCompleted(id, completed)}>Отметить</button>
                                        <button className='tasks__blockBtn_btn' onClick={() => handleClickDelete(task, id, file)}>Удалить</button>
                                    </div>
                                </div>
                            }
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}