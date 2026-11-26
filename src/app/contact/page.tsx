import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import "./contact.css";

export const metadata={title:"Let’s Connect — ZiyoMuhammad",description:"Start a conversation about ideas, learning and collaboration with ZiyoMuhammad."};

function publicEmail(){const value=process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();return value&&/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)?value:null}
export default function ContactPage(){
 const email=publicEmail();
 return <main className="contact-page" id="top"><SiteHeader contact/>
 <section className="contact-opening" aria-labelledby="contact-title">
 <div className="contact-rule"><span>ZM / CORRESPONDENCE</span><span>FROM UZBEKISTAN</span></div>
 <div className="contact-title-grid"><h1 id="contact-title">Say<br/><em>hello.</em></h1><div className="contact-postmark" aria-hidden="true"><svg viewBox="0 0 260 260"><defs><path id="postmark-circle" d="M130 130m-91 0a91 91 0 1 1 182 0a91 91 0 1 1-182 0"/></defs><circle cx="130" cy="130" r="122" fill="none" stroke="currentColor"/><circle cx="130" cy="130" r="72" fill="none" stroke="currentColor"/><text fontSize="13" letterSpacing="2" fill="currentColor"><textPath href="#postmark-circle" textLength="566">GOOD TO MEET YOU · ZM · UZBEKISTAN · LET’S CONNECT · </textPath></text><path d="M130 86l10 34 34 10-34 10-10 34-10-34-34-10 34-10z" fill="currentColor"/></svg></div></div>
 <div className="contact-opening-bottom"><p>A question, an idea, or something worth building together? I’d love to hear about it.</p><a className="contact-text-link" href="#contact-methods">Find me here ↓</a></div>
 </section>
 <section className="contact-letter" id="contact-methods" aria-labelledby="letter-title">
 <div className="contact-rule"><span>01 / AN OPEN LETTER</span><span>PERSONAL NOTES</span></div>
 <div className="contact-letter-grid"><div className="letter-paper"><span className="letter-date">TO: THE CURIOUS</span><h2 id="letter-title">Dear <em>stranger,</em></h2><p>I believe that interesting things often begin with a conversation. Whether you’re working on a project, exploring an idea, or simply want to exchange perspectives, I’m glad you stopped by.</p><p>Thanks for taking the time to explore my little corner of the internet.</p><span className="letter-signoff">Until next time,</span><div className="letter-signature"><Signature/></div></div>
 <div className="contact-methods"><span className="contact-kicker">WHERE TO FIND ME</span>
 {email?<a className="contact-channel" href={"mailto:"+email}><span><small>01 / CORRESPONDENCE</small><strong>Email</strong><span>{email}</span></span><b aria-hidden="true">↗</b></a>:<div className="contact-channel contact-channel-pending"><span><small>01 / CORRESPONDENCE</small><strong>Email</strong><span>Direct contact details coming soon.</span></span></div>}
 <a className="contact-channel" href="https://github.com/iblamezzsh-tech/zm"><span><small>02 / WEBSITE CODE</small><strong>GitHub</strong><span>Explore this portfolio’s repository.</span></span><b aria-hidden="true">↗</b></a>
 <a className="contact-channel" href="https://overthink.uz"><span><small>03 / INITIATIVES</small><strong>OverThink</strong><span>Explore the project website.</span></span><b aria-hidden="true">↗</b></a>
 </div></div></section>
 <section className="contact-ending"><div className="contact-rule"><span>02 / END OF THE PORTFOLIO</span><span>NOT THE END OF THE STORY</span></div><h2>See you<br/><em>around.</em></h2><div className="contact-ending-row"><Link href="/" className="contact-text-link">Back to the beginning ↗</Link><div><Signature/></div></div></section>
 <footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer>
 </main>
}
