import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/context';
import { ref, uploadBytes } from "firebase/storage";
import './formTask.less'

export const FormTask = () => {
    const [titleValue, setTitleValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [dateValue, setDateValue] = useState((new Date().toISOString()).slice(0, 10))
    const { firestore, firestorage } = useContext(AppContext)

    const addTask = async (e) => {
        e.preventDefault()
        const file = e.target[3].files[0]
        const idx = +new Date()
        if (file !== undefined) {
            addFile(file, idx);
        }
        firestore
            .doc(`${idx}`)
            .set({
                id: idx,
                title: titleValue,
                description: descriptionValue,
                date: dateValue,
                file: file === undefined ? '' : file.name,
                completed: false,
            })
            .catch((err) => {
                console.log('err', err)
            })
        setTitleValue('')
        setDescriptionValue('')
    }

    const addFile = (file, id) => {
        const fileRef = ref(firestorage, `todoFile/${id + '_' + file.name}`);
        uploadBytes(fileRef, file)
    }

    return (
        <div className='container'>
            <form className='form' onSubmit={addTask}>
                <div className='form__left'>
                    <label>Заголовок:</label>
                    <input
                        className='form__left_inputTitle'
                        type='text'
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        placeholder='Введите заголовок задачи' />
                    <label>Описание:</label>
                    <textarea
                        className='form__left_inputDescription'
                        type='textarea'
                        rows={4}
                        maxLength={200}
                        placeholder='Введите описание задачи'
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                    />
                </div>
                <div className='form__right'>
                    <label>Дата окончания:</label>
                    <input
                        className='form__right_inputDate'
                        type='date'
                        value={dateValue}
                        onChange={(e) => setDateValue(e.target.value)}
                    />
                    Фото/Документ
                    <input
                        className='form__right_inputFile'
                        type="file"
                        accept="image/*, .doc, .docx, .xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                    <button className='form__right_btnSubmit' type='submit'>Готово</button>
                </div>
            </form>
        </div>
    )
}