import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import "./contact.css";
import "../studio54.css";

export const metadata={title:"Let’s Connect — ZiyoMuhammad",description:"Start a conversation about ideas, learning and collaboration with ZiyoMuhammad."};

function publicEmail(){const value=process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();return value&&/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)?value:null}
export default function ContactPage(){
 const email=publicEmail() ?? "iblamezzsh@gmail.com";
 return <main className="contact-page studio54" id="top"><SiteHeader contact/>
 <section className="contact-opening" aria-labelledby="contact-title">
 <div className="contact-rule"><span>ZM / CORRESPONDENCE</span><span>FROM UZBEKISTAN</span></div>
 <div className="contact-title-grid"><h1 id="contact-title"><MotionWords text="Say"/><br/><em><MotionWords text="hello."/></em></h1><div className="studio54-correspondence"><span>FROM ANDIJAN, UZBEKISTAN</span><div><Signature/></div><span>TO WHEREVER YOU ARE.</span></div></div>
 <div className="contact-opening-bottom"><p>A question, an idea, or something worth building together? I’d love to hear about it.</p><a className="contact-direct" href={"mailto:"+email}>Write to me <span aria-hidden="true">↗</span></a><a className="contact-text-link" href="#contact-methods">Other ways to connect ↓</a></div>
 </section>
 <section className="contact-letter" id="contact-methods" aria-labelledby="letter-title">
 <div className="contact-rule"><span>01 / AN OPEN LETTER</span><span>PERSONAL NOTES</span></div>
 <div className="contact-letter-grid"><div className="letter-paper"><span className="letter-date">TO: THE CURIOUS</span><h2 id="letter-title"><MotionWords text="Dear"/> <em><MotionWords text="stranger,"/></em></h2><p>I believe that interesting things often begin with a conversation. Whether you’re working on a project, exploring an idea, or simply want to exchange perspectives, I’m glad you stopped by.</p><p>Thanks for taking the time to explore my little corner of the internet.</p><span className="letter-signoff">Until next time,</span><div className="letter-signature"><Signature/></div></div>
 <div className="contact-methods"><span className="contact-kicker">WHERE TO FIND ME</span>
 <a className="contact-channel" href={"mailto:"+email}><span><small>01 / CORRESPONDENCE</small><strong>Email</strong><span>{email}</span></span><b aria-hidden="true">↗</b></a>
 <a className="contact-channel" href="https://t.me/Shoxruxbekovich"><span><small>02 / MESSAGE ME</small><strong>Telegram</strong><span>@Shoxruxbekovich</span></span><b aria-hidden="true">↗</b></a>
 <a className="contact-channel" href="https://www.instagram.com/the_zzsh/"><span><small>03 / SOCIAL</small><strong>Instagram</strong><span>@the_zzsh</span></span><b aria-hidden="true">↗</b></a>
 <a className="contact-channel" href="https://github.com/iblamezzsh-tech/zm"><span><small>04 / WEBSITE CODE</small><strong>GitHub</strong><span>Explore this portfolio’s repository.</span></span><b aria-hidden="true">↗</b></a>
 <a className="contact-channel" href="https://overthink.uz"><span><small>05 / INITIATIVES</small><strong>OverThink</strong><span>Explore the project website.</span></span><b aria-hidden="true">↗</b></a>
 </div></div></section>
 <section className="contact-ending"><div className="contact-rule"><span>02 / END OF THE PORTFOLIO</span><span>NOT THE END OF THE STORY</span></div><h2><MotionWords text="See you"/><br/><em><MotionWords text="around."/></em></h2><div className="contact-ending-row"><Link href="/" className="contact-text-link">Back to the beginning ↗</Link><div><Signature/></div></div></section>
 <footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer>
 </main>
}
