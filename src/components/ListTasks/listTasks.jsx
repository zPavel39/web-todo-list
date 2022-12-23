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

    // хук возвращает список задач и состояние загружен ли список
    const [tasks, loading] = useCollectionData(
        firestore.orderBy('completed')     
    )
    // если список не загружен возвращает loading а мог быть(спинер)
    if (loading) {
        return (
            <h2 className='loading'>Loading...</h2>
        )
    }
    if (tasks === undefined) {
        return
    }
    /**
     * Функция удаления задачи
     * @param {*} task задача из списка
     * @param {*} id  id
     * @param {*} file название файла
     */
    const handleClickDelete = async (task, id, file) => {
        //удаляем файл по его названию + id из firestorage
        deleteObject(ref(firestorage, `todoFile/${id + '_' + file}`)).then(() => {
        })
            .catch((error) => {
                console.log('delete error', error)
            });
        // удаляем задачу из списка firestore
        firestore
            .doc(`${task.id}`)
            .delete()

    }
    // функция передачи данных в поля изменения задачи
    const handleClickChange = (id, title, description, date) => {
        setChange(id);
        setTitleValue(title);
        setDescriptionValue(description)
        setDateValue(date)
    }
    /**
     * Функция сохронения изменения задачи
     * @param {*} id id задачи
     * @param {string} titleValue 
     * @param {string} descriptionValue 
     * @param {date} dateValue 
     */
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
    /**
     * Функция отметки о выполнении задачи
     * @param {*} id id задачи
     * @param {boolean} completed 
     */
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
    /**
     * Функция получения URL адреса файла задачи c firestorage
     * @param {*} id id задачи
     * @param {string} file имя файла
     */
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