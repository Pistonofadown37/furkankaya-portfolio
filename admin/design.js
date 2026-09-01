/* FURKAN KAYA - TASARIM EDITORU */
(function () {
  "use strict";

  const client = window.supabaseClient;
  const iframe = document.getElementById("sitePreview");
  const saveButton = document.getElementById("saveButton");
  const resetButton = document.getElementById("resetButton");
  const message = document.getElementById("designMessage");

  const DEFAULTS = {
    color_gold:"#f2ad16",color_gold_light:"#ffd35a",color_gold_dark:"#9a6307",color_black:"#030405",color_dark:"#07090b",color_dark_card:"#0d1013",color_dark_card_2:"#12161a",color_white:"#f4f4f4",color_text:"#e8e8e8",color_muted:"#8b9198",
    container_width:1280,side_padding:40,header_height:82,logo_font_size:21,logo_gap:7,nav_gap:40,nav_font_size:14,nav_padding_y:30,header_button_width:132,header_button_height:48,header_button_radius:6,header_button_font_size:13,
    hero_gap:80,hero_content_max_width:700,hero_content_padding_top:70,hero_content_padding_bottom:110,hero_small_font_size:11,hero_small_letter_spacing:6,hero_title_font_size:100,hero_title_line_height:.98,hero_title_letter_spacing:-5,hero_description_font_size:17,hero_description_max_width:560,hero_description_line_height:1.8,hero_buttons_gap:16,hero_button_height:58,hero_button_padding:25,hero_button_gap:25,hero_button_radius:6,hero_button_font_size:13,hero_gold_glow_size:500,
    brand_letter_1:"F",brand_letter_2:"K",brand_name:"REKLAM",brand_font_size:330,brand_gap:10,brand_letter_spacing:-30,brand_name_font_size:70,brand_name_letter_spacing:18,brand_name_margin_top:30,brand_line_width:70,brand_line_height:2,brand_line_margin_top:38,brand_glow_size:480,brand_glow_blur:15,
    section_padding:115,section_heading_gap:60,section_heading_margin_bottom:55,section_title_font_size:64,section_title_letter_spacing:-2,portfolio_columns:4,portfolio_columns_tablet:2,portfolio_gap:20,portfolio_radius:10,portfolio_image_height:245,portfolio_info_padding:20,slider_arrow_size:48,about_gap:100,about_text_font_size:16,about_text_line_height:1.9,services_gap:20,service_card_padding:35,service_card_radius:12,service_icon_size:70,service_card_min_height:200,service_card_gap:25,service_columns:3,contact_padding:60,contact_gap:60,contact_radius:14,contact_link_height:140,contact_link_padding:28,contact_section_padding:120,contact_title_font_size:58,contact_text_font_size:14,footer_padding:32,brands_height:100,brands_gap:30,brands_font_size:16,brands_letter_spacing:2,brands_item_1:"DESIGN",brands_item_2:"BRANDING",brands_item_3:"GRAPHIC",brands_item_4:"CREATIVE",brands_item_5:"DIGITAL",brands_item_6:"ADVERTISING",scroll_down_symbol:"↓",scroll_down_size:30,
    content_page_title:"Furkan Kaya | Grafik Tasarım",
    content_meta_description:"Furkan Kaya - Grafik Tasarım ve Dijital Çözümler Portföyü",
    content_logo_first:"FURKAN",content_logo_second:"KAYA.",content_nav_1:"Ana Sayfa",content_nav_2:"Portföy",content_nav_3:"Hakkımda",content_nav_4:"İletişim",content_header_contact:"İletişime Geç",
    content_hero_small:"GRAFİK TASARIM & DİJİTAL ÇÖZÜMLER",content_hero_title_1:"Fikirleri",content_hero_title_highlight:"etkileyici",content_hero_title_2:"tasarımlara",content_hero_title_strong:"dönüştürüyorum.",content_hero_description:"Markalar, işletmeler ve projeler için modern, dikkat çekici ve özgün görsel çözümler üretiyorum.",content_hero_button_1:"Çalışmalarımı İncele",content_hero_button_2:"Benimle İletişime Geç",
    content_portfolio_small:"PORTFÖY",content_portfolio_title:"Seçili Çalışmalar",content_portfolio_description:"Farklı sektörler ve markalar için hazırladığım tasarım çalışmalarından bazıları.",content_portfolio_loading:"Çalışmalar yükleniyor...",
    content_about_small:"HAKKIMDA",content_about_title_1:"Tasarım sadece",content_about_title_2:"güzel görünmek değildir.",content_about_text:"Her projenin kendine ait bir hikayesi olduğuna inanıyorum. Bu nedenle tasarım sürecinde sadece estetik değil, markanın karakterini, hedef kitlesini ve vermek istediği mesajı da ön planda tutuyorum.",
    content_stat_1_number:"01",content_stat_1_title:"Özgün Tasarım",content_stat_1_text:"Her projeye özel yaratıcı çözümler sunuyorum.",content_stat_2_number:"02",content_stat_2_title:"Modern Yaklaşım",content_stat_2_text:"Güncel trendleri takip ederek modern tasarımlar üretiyorum.",content_stat_3_number:"03",content_stat_3_title:"Dijital Çözümler",content_stat_3_text:"Dijital platformlar için etkili tasarımlar hazırlıyorum.",
    content_services_small:"NELER YAPIYORUM?",content_services_title:"Tasarım Hizmetleri",content_service_1_title:"Grafik Tasarım",content_service_1_text:"Sosyal medya, reklam, broşür, afiş ve kurumsal tasarım çözümleri.",content_service_2_title:"Marka Tasarımı",content_service_2_text:"Logo, kurumsal kimlik ve markanızın görsel dünyasının oluşturulması.",content_service_3_title:"Dijital Tasarım",content_service_3_text:"Dijital platformlar için modern ve dikkat çekici tasarım çözümleri.",
    content_contact_small:"BİRLİKTE ÇALIŞALIM",content_contact_title:"Yeni bir proje mi düşünüyorsunuz?",content_contact_text:"Projeniz, markanız veya tasarım ihtiyacınız hakkında benimle iletişime geçebilirsiniz.",content_email_label:"E-POSTA",content_whatsapp_label:"WHATSAPP",content_instagram_label:"INSTAGRAM",content_footer_text:"Furkan Kaya. Tüm hakları saklıdır.",
    mobile_hero_gap:0,mobile_header_height:82,mobile_side_padding:20,mobile_hero_title_size:52,mobile_hero_title_size_small:52,mobile_hero_description_size:14,mobile_hero_description_size_small:14,mobile_hero_visual_height:330,mobile_hero_padding_top:100,mobile_hero_padding_bottom:20,mobile_brand_size:180,mobile_brand_spacing:-18,mobile_brand_name_size:35,mobile_brand_name_spacing:9,mobile_section_padding:80,mobile_portfolio_image_height:300,mobile_portfolio_image_height_small:240,mobile_contact_padding:25,mobile_button_height:58,mobile_button_gap:16
  };

  let settings = {...DEFAULTS};

  function showMessage(text,type){
    if(!message)return;
    message.textContent=text;
    message.className="design-message "+type+" show";
    clearTimeout(showMessage.timer);
    showMessage.timer=setTimeout(()=>message.classList.remove("show"),5000);
  }

  function valueOf(input){
    if(input.type==="range") return Number(input.value);
    return input.value;
  }

  function output(input){
    const el=document.querySelector('[data-output="'+input.dataset.key+'"]');
    if(!el)return;
    let v=valueOf(input);
    if(input.type==="range"){
      if(input.dataset.key==="brand_line_width") el.textContent=v+" %";
      else if(input.dataset.key.includes("line_height")) el.textContent=Number(v).toFixed(2);
      else el.textContent=v+" px";
    }else el.textContent=v;
  }

  function controls(){
    document.querySelectorAll("[data-key]").forEach(input=>{
      const key=input.dataset.key;
      input.addEventListener("input",()=>{
        settings[key]=valueOf(input);
        output(input);
        renderPreview();
      });
    });
  }

  function fill(){
    document.querySelectorAll("[data-key]").forEach(input=>{
      if(settings[input.dataset.key]===undefined)return;
      input.value=settings[input.dataset.key];
      output(input);
    });
  }

  function setText(doc, selector, value){
    doc.querySelectorAll(selector).forEach(el=>{ el.textContent = value ?? ""; });
  }

  function escapeHtml(value){
    return String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
  }

  function applyContent(doc){
    if(settings.content_page_title) doc.title = settings.content_page_title;
    const meta = doc.querySelector('meta[name="description"]');
    if(meta && settings.content_meta_description) meta.setAttribute("content", settings.content_meta_description);
    setText(doc,".site-logo strong",settings.content_logo_first);
    setText(doc,".site-logo span",settings.content_logo_second);
    const nav=[settings.content_nav_1,settings.content_nav_2,settings.content_nav_3,settings.content_nav_4];
    doc.querySelectorAll(".main-nav .nav-link, .mobile-nav-link").forEach((el,i)=>{ if(nav[i%4]!==undefined) el.textContent=nav[i%4]; });
    setText(doc,".header-contact-button",settings.content_header_contact);
    setText(doc,".hero-small-text",settings.content_hero_small);
    const hero=doc.querySelector(".hero-title");
    if(hero){ hero.innerHTML=escapeHtml(settings.content_hero_title_1)+" <span>"+escapeHtml(settings.content_hero_title_highlight)+"</span> "+escapeHtml(settings.content_hero_title_2)+" <strong>"+escapeHtml(settings.content_hero_title_strong)+"</strong>"; }
    setText(doc,".hero-description",settings.content_hero_description);
    setText(doc,".primary-button span",settings.content_hero_button_1);
    setText(doc,".secondary-button span",settings.content_hero_button_2);
    setText(doc,".portfolio-section .section-small-title",settings.content_portfolio_small);
    setText(doc,".portfolio-section .section-heading h2",settings.content_portfolio_title);
    setText(doc,".portfolio-section .section-heading > p",settings.content_portfolio_description);
    setText(doc,".portfolio-loading",settings.content_portfolio_loading);
    setText(doc,".about-heading .section-small-title",settings.content_about_small);
    const aboutTitle=doc.querySelector(".about-heading h2");
    if(aboutTitle) aboutTitle.innerHTML=escapeHtml(settings.content_about_title_1)+"<br>"+escapeHtml(settings.content_about_title_2);
    setText(doc,"#aboutText",settings.content_about_text);
    const stats=[1,2,3];
    stats.forEach(i=>{ setText(doc,`.about-stat:nth-child(${i}) strong`,settings[`content_stat_${i}_number`]); setText(doc,`.about-stat:nth-child(${i}) h3`,settings[`content_stat_${i}_title`]); setText(doc,`.about-stat:nth-child(${i}) p`,settings[`content_stat_${i}_text`]); });
    setText(doc,".services-heading .section-small-title",settings.content_services_small);
    setText(doc,".services-heading h2",settings.content_services_title);
    stats.forEach(i=>{ setText(doc,`.service-card:nth-child(${i}) h3`,settings[`content_service_${i}_title`]); setText(doc,`.service-card:nth-child(${i}) p`,settings[`content_service_${i}_text`]); });
    setText(doc,".contact-small-title",settings.content_contact_small);
    setText(doc,".contact-content h2",settings.content_contact_title);
    setText(doc,".contact-content p",settings.content_contact_text);
    setText(doc,".contact-link-label",settings.content_email_label);
    const labels=[settings.content_email_label,settings.content_whatsapp_label,settings.content_instagram_label];
    doc.querySelectorAll(".contact-link-label").forEach((el,i)=>{el.textContent=labels[i]||"";});
    const footer=doc.querySelector(".site-footer p");
    if(footer) footer.innerHTML="© <span id=\"currentYear\"></span> "+escapeHtml(settings.content_footer_text);
    const year=doc.querySelector("#currentYear");
    if(year) year.textContent=new Date().getFullYear();
  }

  function renderPreview(){
    if(!iframe || !iframe.contentDocument)return;
    const doc=iframe.contentDocument;
    const root=doc.documentElement;
    const body=doc.body;
    if(!body)return;

    applyContent(doc);

    const q=s=>doc.querySelector(s);
    const all=s=>doc.querySelectorAll(s);
    const px=v=>typeof v==="number"?v+"px":v;
    const set=(s,p,v)=>all(s).forEach(el=>el.style.setProperty(p,v,"important"));

    const f= q(".brand-f"), k=q(".brand-k"), bn=q(".hero-brand-name");
    if(f)f.textContent=settings.brand_letter_1;
    if(k)k.textContent=settings.brand_letter_2;
    if(bn)bn.textContent=settings.brand_name;

    const brandItems=[settings.brands_item_1,settings.brands_item_2,settings.brands_item_3,settings.brands_item_4,settings.brands_item_5,settings.brands_item_6];
    all(".brands-container span").forEach((el,i)=>{ if(brandItems[i] !== undefined) el.textContent=brandItems[i]; });
    const scrollDown=q(".scroll-down");
    if(scrollDown){ scrollDown.textContent=settings.scroll_down_symbol; scrollDown.style.fontSize=px(settings.scroll_down_size); }

    root.style.setProperty("--gold",settings.color_gold);
    root.style.setProperty("--gold-light",settings.color_gold_light);
    root.style.setProperty("--gold-dark",settings.color_gold_dark);
    root.style.setProperty("--black",settings.color_black);
    root.style.setProperty("--dark",settings.color_dark);
    root.style.setProperty("--dark-card",settings.color_dark_card);
    root.style.setProperty("--dark-card-2",settings.color_dark_card_2);
    root.style.setProperty("--white",settings.color_white);
    root.style.setProperty("--text",settings.color_text);
    root.style.setProperty("--muted",settings.color_muted);
    root.style.setProperty("--container",px(settings.container_width));

    set(".site-header","height",px(settings.header_height));
    set(".header-container,.section-container,.footer-container,.hero-container","width","min("+px(settings.container_width)+", calc(100% - "+px(settings.side_padding*2)+"))");
    set(".site-logo","font-size",px(settings.logo_font_size));
    set(".site-logo","gap",px(settings.logo_gap));
    set(".main-nav","gap",px(settings.nav_gap));
    set(".nav-link","font-size",px(settings.nav_font_size));
    set(".header-contact-button","width",px(settings.header_button_width));
    set(".header-contact-button","height",px(settings.header_button_height));
    set(".header-contact-button","border-radius",px(settings.header_button_radius));
    set(".header-contact-button","font-size",px(settings.header_button_font_size));

    set(".hero-container","gap",px(settings.hero_gap));
    set(".hero-content","max-width",px(settings.hero_content_max_width));
    set(".hero-content","padding",px(settings.hero_content_padding_top)+" 0 "+px(settings.hero_content_padding_bottom));
    set(".hero-small-text","font-size",px(settings.hero_small_font_size));
    set(".hero-small-text","letter-spacing",px(settings.hero_small_letter_spacing));
    set(".hero-title","font-size",px(settings.hero_title_font_size));
    set(".hero-title","line-height",settings.hero_title_line_height);
    set(".hero-title","letter-spacing",px(settings.hero_title_letter_spacing));
    set(".hero-description","font-size",px(settings.hero_description_font_size));
    set(".hero-description","max-width",px(settings.hero_description_max_width));
    set(".hero-description","line-height",settings.hero_description_line_height);
    set(".hero-buttons","gap",px(settings.hero_buttons_gap));
    set(".primary-button,.secondary-button","height",px(settings.hero_button_height));
    set(".primary-button,.secondary-button","padding-left",px(settings.hero_button_padding));
    set(".primary-button,.secondary-button","padding-right",px(settings.hero_button_padding));
    set(".primary-button,.secondary-button","gap",px(settings.hero_button_gap));
    set(".primary-button,.secondary-button","border-radius",px(settings.hero_button_radius));
    set(".primary-button,.secondary-button","font-size",px(settings.hero_button_font_size));
    set(".hero-gold-glow","width",px(settings.hero_gold_glow_size));
    set(".hero-gold-glow","height",px(settings.hero_gold_glow_size));

    set(".hero-brands","min-height",px(settings.brands_height));
    set(".brands-container","gap",px(settings.brands_gap));
    set(".brands-container span","font-size",px(settings.brands_font_size));
    set(".brands-container span","letter-spacing",px(settings.brands_letter_spacing));
    set(".scroll-down","font-size",px(settings.scroll_down_size));

    set(".hero-brand-main","font-size",px(settings.brand_font_size));
    set(".hero-brand-main","gap",px(settings.brand_gap));
    set(".hero-brand-main","letter-spacing",px(settings.brand_letter_spacing));
    set(".hero-brand-name","font-size",px(settings.brand_name_font_size));
    set(".hero-brand-name","letter-spacing",px(settings.brand_name_letter_spacing));
    set(".hero-brand-name","margin-top",px(settings.brand_name_margin_top));
    set(".brand-line","width",settings.brand_line_width+"%");
    set(".brand-line","height",px(settings.brand_line_height));
    set(".brand-line","margin-top",px(settings.brand_line_margin_top));
    set(".brand-glow","width",px(settings.brand_glow_size));
    set(".brand-glow","height",px(settings.brand_glow_size));
    set(".brand-glow","filter","blur("+px(settings.brand_glow_blur)+")");

    set(".portfolio-section,.about-section,.services-section","padding-top",px(settings.section_padding));
    set(".portfolio-section,.about-section,.services-section","padding-bottom",px(settings.section_padding));
    set(".section-heading","gap",px(settings.section_heading_gap));
    set(".section-heading","margin-bottom",px(settings.section_heading_margin_bottom));
    set(".section-heading h2","font-size",px(settings.section_title_font_size));
    set(".section-heading h2","letter-spacing",px(settings.section_title_letter_spacing));
    set(".portfolio-slider","grid-template-columns","repeat("+settings.portfolio_columns+", 1fr)");
    set(".portfolio-slider","gap",px(settings.portfolio_gap));
    set(".portfolio-card","border-radius",px(settings.portfolio_radius));
    set(".portfolio-image","height",px(settings.portfolio_image_height));
    set(".portfolio-info","padding",px(settings.portfolio_info_padding));
    set(".slider-arrow","width",px(settings.slider_arrow_size));
    set(".slider-arrow","height",px(settings.slider_arrow_size));
    set(".about-grid","gap",px(settings.about_gap));
    set(".about-content p","font-size",px(settings.about_text_font_size));
    set(".about-content p","line-height",settings.about_text_line_height);
    set(".services-grid","gap",px(settings.services_gap));
    set(".services-grid","grid-template-columns","repeat("+settings.service_columns+", 1fr)");
    set(".service-card","padding",px(settings.service_card_padding));
    set(".service-card","border-radius",px(settings.service_card_radius));
    set(".service-card","min-height",px(settings.service_card_min_height));
    set(".service-card","gap",px(settings.service_card_gap));
    set(".service-icon","width",px(settings.service_icon_size));
    set(".service-icon","height",px(settings.service_icon_size));
    set(".contact-section","padding-top",px(settings.contact_section_padding));
    set(".contact-section","padding-bottom",px(settings.contact_section_padding));
    set(".contact-box","padding",px(settings.contact_padding));
    set(".contact-box","gap",px(settings.contact_gap));
    set(".contact-box","border-radius",px(settings.contact_radius));
    set(".contact-link","min-height",px(settings.contact_link_height));
    set(".contact-link","padding-left",px(settings.contact_link_padding));
    set(".contact-link","padding-right",px(settings.contact_link_padding));
    set(".contact-content h2","font-size",px(settings.contact_title_font_size));
    set(".contact-content p","font-size",px(settings.contact_text_font_size));
    set(".site-footer","padding-top",px(settings.footer_padding));
    set(".site-footer","padding-bottom",px(settings.footer_padding));

    let style=doc.getElementById("fkDesignPreviewStyle");
    if(!style){style=doc.createElement("style");style.id="fkDesignPreviewStyle";doc.head.appendChild(style);}
    style.textContent=`@media(max-width:1100px){.portfolio-slider{grid-template-columns:repeat(${settings.portfolio_columns_tablet},1fr)!important}.hero-container{gap:${px(settings.mobile_hero_gap)}!important}.hero-brand-main{font-size:${px(Math.min(settings.mobile_brand_size,260))}!important}.hero-brand-name{font-size:${px(settings.mobile_brand_name_size)}!important;letter-spacing:${px(settings.mobile_brand_name_spacing)}!important}.hero-visual{min-height:${px(settings.mobile_hero_visual_height)}!important}}@media(max-width:800px){.site-header{height:${px(settings.mobile_header_height)}!important}.section-container,.header-container,.footer-container,.hero-container{width:calc(100% - ${px(settings.mobile_side_padding*2)})!important}.hero-content{padding-top:${px(settings.mobile_hero_padding_top)}!important;padding-bottom:${px(settings.mobile_hero_padding_bottom)}!important}.hero-title{font-size:${px(settings.mobile_hero_title_size)}!important}.hero-description{font-size:${px(settings.mobile_hero_description_size)}!important}.hero-brand-main{font-size:${px(settings.mobile_brand_size)}!important;letter-spacing:${px(settings.mobile_brand_spacing)}!important}.hero-brand-name{font-size:${px(settings.mobile_brand_name_size)}!important;letter-spacing:${px(settings.mobile_brand_name_spacing)}!important}.portfolio-image{height:${px(settings.mobile_portfolio_image_height)}!important}.contact-box{padding:${px(settings.mobile_contact_padding)}!important}.primary-button,.secondary-button{height:${px(settings.mobile_button_height)}!important}.hero-buttons{gap:${px(settings.mobile_button_gap)}!important}.portfolio-section,.about-section,.services-section{padding-top:${px(settings.mobile_section_padding)}!important;padding-bottom:${px(settings.mobile_section_padding)}!important}}@media(max-width:500px){.hero-title{font-size:${px(settings.mobile_hero_title_size_small)}!important}.hero-description{font-size:${px(settings.mobile_hero_description_size_small)}!important}.portfolio-image{height:${px(settings.mobile_portfolio_image_height_small)}!important}}`;
  }

  async function load(){
    if(!client){showMessage("Supabase bağlantısı bulunamadı.","error");return;}
    const session=await client.auth.getSession();
    if(session.error||!session.data?.session){location.href="login.html";return;}
    try{
      const [designResult,contentResult]=await Promise.all([
        client.from("site_settings").select("setting_key,setting_value").like("setting_key","design_%"),
        client.from("site_settings").select("setting_key,setting_value").like("setting_key","content_%")
      ]);
      if(designResult.error)throw designResult.error;
      if(contentResult.error)throw contentResult.error;
      [...(designResult.data||[]),...(contentResult.data||[])].forEach(row=>{
        const key=row.setting_key.replace(/^(design_|content_)/,'');
        const fullKey=row.setting_key.startsWith("content_") ? "content_"+key : key;
        settings[fullKey]=parse(row.setting_value);
      });
      fill();
      renderPreview();
    }catch(e){console.error(e);showMessage("Tasarım ayarları yüklenemedi: "+(e.message||e.code||"Bilinmeyen hata"),"error");}
  }

  function parse(v){
    if(typeof v!=="string")return v;
    if(/^-?\d+(\.\d+)?$/.test(v.trim()))return Number(v);
    return v;
  }

  async function save(){
    if(!client){showMessage("Supabase bağlantısı bulunamadı.","error");return;}
    if(!saveButton)return;

    saveButton.disabled=true;
    const oldText=saveButton.textContent;
    saveButton.textContent="Kaydediliyor...";
    showMessage("Tasarım ayarları kaydediliyor...","info");

    try{
      const rows=Object.entries(settings).map(([key,value])=>({
        setting_key:(key.startsWith("content_") ? key : "design_"+key),
        setting_value:String(value),
        updated_at:new Date().toISOString()
      }));

      // Önce mevcut kayıtları tek seferde alıyoruz. Böylece her ayar için
      // ayrı ayrı SELECT yapıp kaydetmeyi bekletmiyoruz.
      const keys=rows.map(row=>row.setting_key);
      const {data:existing,error:selectError}=await client
        .from("site_settings")
        .select("id,setting_key")
        .in("setting_key",keys);

      if(selectError)throw selectError;

      const existingMap=new Map((existing||[]).map(row=>[row.setting_key,row.id]));
      const updates=[];
      const inserts=[];

      for(const row of rows){
        const id=existingMap.get(row.setting_key);
        if(id){
          updates.push({id,setting_value:row.setting_value,updated_at:row.updated_at});
        }else{
          inserts.push(row);
        }
      }

      // Yeni kayıtları tek istekte ekle.
      if(inserts.length){
        const {error}=await client.from("site_settings").insert(inserts);
        if(error)throw error;
      }

      // Güncellemeleri küçük gruplar halinde paralel yapıyoruz.
      // Böylece Kaydediliyor... ekranında uzun süre takılı kalmaz.
      const batchSize=10;
      for(let i=0;i<updates.length;i+=batchSize){
        const batch=updates.slice(i,i+batchSize);
        const results=await Promise.all(batch.map(row=>
          client.from("site_settings")
            .update({setting_value:row.setting_value,updated_at:row.updated_at})
            .eq("id",row.id)
        ));
        const failed=results.find(result=>result.error);
        if(failed?.error)throw failed.error;
      }

      // Kayıtların gerçekten oluştuğunu kısa bir doğrulamayla kontrol et.
      const {data:check,error:checkError}=await client
        .from("site_settings")
        .select("setting_key")
        .in("setting_key",keys);
      if(checkError)throw checkError;

      if((check||[]).length<rows.length){
        throw new Error("Bazı tasarım ayarları veritabanında bulunamadı.");
      }

      showMessage("✓ Tasarım ayarları başarıyla kaydedildi.","success");
      saveButton.textContent="✓ Kaydedildi";
      setTimeout(()=>{
        if(saveButton&&!saveButton.disabled)saveButton.textContent=oldText;
      },1800);
    }catch(e){
      console.error("Tasarım kaydetme hatası:",e);
      showMessage("Kaydetme hatası: "+(e.message||e.code||"Bilinmeyen hata"),"error");
      saveButton.textContent="Tekrar Dene";
    }finally{
      saveButton.disabled=false;
      setTimeout(()=>{
        if(saveButton&&saveButton.textContent==="Kaydediliyor...")saveButton.textContent=oldText;
      },100);
    }
  }

  function reset(){settings={...DEFAULTS};fill();renderPreview();showMessage("Varsayılan değerler önizlemeye uygulandı. Kaydet'e basarsan kalıcı olur.","success");}

  function tabs(){
    const ts=document.querySelectorAll(".design-tab"),ps=document.querySelectorAll(".design-panel");
    ts.forEach(t=>t.addEventListener("click",()=>{ts.forEach(x=>x.classList.remove("active"));ps.forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelector('[data-panel-content="'+t.dataset.panel+'"]')?.classList.add("active");}));
  }

  function previewSizes(){
    document.querySelectorAll(".preview-size").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".preview-size").forEach(x=>x.classList.remove("active"));b.classList.add("active");iframe.style.width=b.dataset.width;iframe.style.maxWidth="100%";renderPreview();}));
  }

  async function init(){
    controls();tabs();previewSizes();
    if(saveButton)saveButton.addEventListener("click",save);
    if(resetButton)resetButton.addEventListener("click",reset);
    const logout=document.getElementById("logoutButton");
    if(logout)logout.addEventListener("click",async()=>{await client?.auth.signOut();location.href="login.html";});
    if(iframe)iframe.addEventListener("load",()=>setTimeout(renderPreview,100));
    await load();
    setTimeout(renderPreview,300);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
