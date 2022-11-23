import React, { useContext, useState } from 'react'
import './formTask.less'
import { AppContext } from '../../context/context';

export const FormTask = () => {
    const [titleValue, setTitleValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [dateValue, setDateValue] = useState((new Date().toISOString()).slice(0, 10))
    const [fileValue, setFileValue] = useState()
    const { ref } = useContext(AppContext)

    const addTask = async (e) => {
        e.preventDefault()
        const idx = +new Date()
        ref
            .doc(`${idx}`)
            .set({
                id: idx,
                title: titleValue,
                description: descriptionValue,
                date: dateValue,
                file: fileValue,
            })
            .catch((err) => {
                console.log('err', err)
            })
        setTitleValue('')
        setDescriptionValue('')
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
                        defaultValue={descriptionValue}
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
                        onChange={(e) => setFileValue(e.target.value)}
                    />
                    <button className='form__right_btnSubmit' type='submit'>Готово</button>
                </div>
            </form>
        </div>
    )
}