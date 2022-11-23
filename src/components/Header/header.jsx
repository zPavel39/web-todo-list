import React from 'react'
import './header.less'

export const Header = () => {
    return (
        <header className='header'>
            <h1 className='header__title'>ToDoList</h1>
            <a href='#'>
                <img className='header__image' src='/logo_gh.png'></img>
            </a>
        </header>
    )
}