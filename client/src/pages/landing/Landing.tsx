import { Link } from 'react-router-dom'
import './Landing.css'

export const Landing = () => {
    return (
        <>

            <section id="hero">
                <div className="hero-content">
                    <h1>Строительство будущего сегодня</h1>
                    <p>Мы предоставляем широкий спектр строительных услуг для ваших проектов</p>
                    <a href="#contact" className="btn">Связаться с нами</a>
                </div>
            </section>

            <section id="services">
                <div className="container">
                    <h2>Наши услуги</h2>
                    <p>Мы специализируемся на следующих видах деятельности:</p>
                    <ul>
                        <li>Производство общестроительных работ</li>
                        <li>Строительство зданий и сооружений</li>
                    </ul>
                    <Link to={'/services'} type="submit">Все услуги</Link>
                </div>
            </section>

            <section id="about">
                <div className="container">
                    <h2>О нашей компании</h2>
                    <p>Мы - компания, которая занимается профессиональным строительством уже более десяти лет. Наша команда состоит из высококвалифицированных специалистов, готовых реализовать самые сложные проекты в срок и с максимальной эффективностью.</p>
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
                    <form action="#" method="post">
                        <input type="text" name="name" placeholder="Ваше имя" required />
                        <input type="email" name="email" placeholder="Ваш Email" required />
                        <textarea name="message" placeholder="Ваше сообщение" required></textarea>
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
