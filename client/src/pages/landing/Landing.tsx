import { Link } from 'react-router-dom'
import './Landing.css'
import { useState } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { $api } from '../../shared/api'

export const Landing = () => {

    const user = useAppSelector(state => state.auth)

    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [message, setMessage] = useState('')

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        $api.post('/bid', {
            name,
            email,
            message
        })
        .then(res => {
            if (res.status === 200) {
                alert('Заявка отправлена')
            }
        })
    }

    return (
        <>

            <section id="hero">
                <div className="hero-content">
                    <h1>Всегда на связи</h1>
                    <p>Мы предоставляем широкий спектр строительных услуг для ваших проектов</p>
                    <a href="#contact" className="btn">Связаться с нами</a>
                </div>
            </section>

            <section id="services">
                <div className="container">
                    <h2>Наши услуги</h2>
                    <ul>
                        <li>подготовка строительного участка</li>
                        <li>разборка и снос зданий; производство земляных работ</li>
                        <li>разборка и снос зданий; расчистка строительных участков</li>
                        <li>строительство зданий и сооружений</li>
                        <li>производство общестроительных работ по возведению зданий</li>
                        <li>производство общестроительных работ по прокладке местных трубопроводов, линий связи, линий электропередач, включая взаимосвязанные вспомогательные работы</li>
                        <li>производство общестроительных работ по строительству прочих зданий и сооружений, не включенных в другие группировки</li>
                        <li>монтаж зданий и сооружений из сборных конструкций</li>
                        <li>устройство покрытий зданий и сооружений</li>
                        <li>строительство спортивных сооружений</li>
                        <li>производство прочих строительных работ</li>
                        <li>монтаж строительных лесов и подмостей</li>
                        <li>строительство фундаментов и бурений водяных скважин</li>
                        <li>производство бетонных и железобетонных работ</li>
                        <li>монтаж металлических строительных конструкций</li>
                        <li>производство каменных работ</li>
                        <li>производство прочих строительных работ, требующих специальной квалификации</li>
                        <li>монтаж инженерного оборудования зданий и сооружений</li>
                        <li>производство электромонтажных работ</li>
                        <li>производство изоляционных работ</li>
                        <li>производство санитарно-тeхнических работ</li>
                        <li>монтаж прочего инженерного оборудования</li>
                        <li>производство отделочных работ</li>
                        <li>производство штукатурных работ</li>
                        <li>производство столярных и плотничных работ</li>
                        <li>устройство покрытий полов и облицовка стен</li>
                        <li>производство малярных и стекольных работ</li>
                        <li>производство стекольных работ</li>
                        <li>производство малярных работ</li>
                        <li>производство прочих отделочных и завершающих работ</li>
                        <li>аренда строительных машин и оборудования с оператором</li>
                    </ul>
                    <Link to={'/services'} type="submit">Все услуги</Link>
                </div>
            </section>

            <section id="about">
                <div className="container">
                    <h2>О нашей компании</h2>
                    <p>Основным видом деятельности общества является производство общестроительных работ по прокладке магистральных трубопроводов, линий связи и линий электропередачи.</p>
                    <p>Мы стремимся к высокому качеству строительных работ и довольным клиентам. Наш опыт позволяет нам предложить индивидуальные решения для каждого проекта, учитывая все требования и пожелания заказчика.</p>
                </div>
            </section>

            <section id="portfolio">
                <div className="container">
                    <h2>Наше портфолио</h2>
                    <div className="portfolio-gallery">
                        <div className="portfolio-item">
                            <img src="https://internationalinvestment.biz/uploads/posts/2020-10/1603700200_marina-bay.jpg" alt="Проект 1"></img>
                            <h3>Проект 1</h3>
                            <p>Описание проекта 1</p>
                        </div>
                        <div className="portfolio-item">
                            <img src="https://internationalinvestment.biz/uploads/posts/2020-10/1603700200_marina-bay.jpg" alt="Проект 1"></img>
                            <h3>Проект 1</h3>
                            <p>Описание проекта 1</p>
                        </div>
                        <div className="portfolio-item">
                            <img src="https://internationalinvestment.biz/uploads/posts/2020-10/1603700200_marina-bay.jpg" alt="Проект 1"></img>
                            <h3>Проект 1</h3>
                            <p>Описание проекта 1</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="process">
                <div className="container">
                    <h2>Наш процесс работы</h2>
                    <p>Мы предлагаем клиентам прозрачный и эффективный процесс работы:</p>
                    <ol>
                        <li>Консультация и планирование</li>
                        <li>Разработка проекта</li>
                        <li>Исполнение работ</li>
                        <li>Контроль качества</li>
                        <li>Сдача проекта</li>
                    </ol>
                </div>
            </section>

            <section id="testimonials">
                <div className="container">
                    <h2>Отзывы наших клиентов</h2>
                    <div className="testimonial">
                        <p>"Наш проект был реализован профессионально и в срок. Благодарим компанию за отличную работу!"</p>
                        <p>- Иван Иванов, Генеральный директор ООО "Клиент", Москва</p>
                    </div>
                    <div className="testimonial">
                        <p>"Компания продемонстрировала высокий уровень профессионализма и ответственности. Мы остались очень довольны результатом."</p>
                        <p>- Елена Петрова, Заказчик, Санкт-Петербург</p>
                    </div>
                </div>
            </section>

            <section id="pricing">
                <div id='contact' className="container">
                    <h2>Наши цены</h2>
                    <p>Цены на наши услуги зависят от объема работ и специфики проекта. Для получения более точной информации, свяжитесь с нами.</p>
                    <form onSubmit={submitForm}>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" name="name" placeholder="Ваше имя" required />
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Ваш Email" required />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} name="message" placeholder="Ваше сообщение" required></textarea>
                        <button type="submit">Отправить</button>
                    </form>
                </div>
            </section>


            <footer>
                <div className="container">
                    <p>&copy; 2024 Название вашей компании. Все права защищены.</p>
                </div>
            </footer>
        </>
    )
}
