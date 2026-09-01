/* FURKAN KAYA - DESIGN RUNTIME */
(function(){
  "use strict";

  if(!document.querySelector(".site-header")) return;

  const client = window.supabaseClient;

  const D = {
    color_gold:"#f2ad16",
    color_gold_light:"#ffd35a",
    color_gold_dark:"#9a6307",
    color_black:"#030405",
    color_dark:"#07090b",
    color_dark_card:"#0d1013",
    color_dark_card_2:"#12161a",
    color_white:"#f4f4f4",
    color_text:"#e8e8e8",
    color_muted:"#8b9198",

    container_width:1280,
    side_padding:40,

    header_height:82,
    logo_font_size:21,
    logo_gap:7,
    nav_gap:40,
    nav_font_size:14,
    header_button_width:132,
    header_button_height:48,
    header_button_radius:6,
    header_button_font_size:13,

    hero_gap:80,
    hero_content_max_width:700,
    hero_content_padding_top:70,
    hero_content_padding_bottom:110,
    hero_small_font_size:11,
    hero_small_letter_spacing:6,
    hero_title_font_size:100,
    hero_title_line_height:.98,
    hero_title_letter_spacing:-5,
    hero_description_font_size:17,
    hero_description_max_width:560,
    hero_description_line_height:1.8,
    hero_buttons_gap:16,
    hero_button_height:58,
    hero_button_padding:25,
    hero_button_gap:25,
    hero_button_radius:6,
    hero_button_font_size:13,
    hero_gold_glow_size:500,

    brand_letter_1:"F",
    brand_letter_2:"K",
    brand_name:"REKLAM",
    brand_font_size:330,
    brand_gap:10,
    brand_letter_spacing:-30,
    brand_name_font_size:70,
    brand_name_letter_spacing:18,
    brand_name_margin_top:30,
    brand_line_width:70,
    brand_line_height:2,
    brand_line_margin_top:38,
    brand_glow_size:480,
    brand_glow_blur:15,

    section_padding:115,
    section_heading_gap:60,
    section_heading_margin_bottom:55,
    section_title_font_size:64,
    section_title_letter_spacing:-2,

    portfolio_columns:4,
    portfolio_columns_tablet:2,
    portfolio_gap:20,
    portfolio_radius:10,
    portfolio_image_height:245,
    portfolio_info_padding:20,
    slider_arrow_size:48,

    about_gap:100,
    about_text_font_size:16,
    about_text_line_height:1.9,

    services_gap:20,
    service_card_padding:35,
    service_card_radius:12,
    service_icon_size:70,
    service_card_min_height:200,
    service_card_gap:25,
    service_columns:3,

    contact_padding:60,
    contact_gap:60,
    contact_radius:14,
    contact_link_height:140,
    contact_link_padding:28,
    contact_section_padding:120,
    contact_title_font_size:58,
    contact_text_font_size:14,

    footer_padding:32,

    brands_height:100,
    brands_gap:30,
    brands_font_size:16,
    brands_letter_spacing:2,
    brands_item_1:"DESIGN",
    brands_item_2:"BRANDING",
    brands_item_3:"GRAPHIC",
    brands_item_4:"CREATIVE",
    brands_item_5:"DIGITAL",
    brands_item_6:"ADVERTISING",

    scroll_down_symbol:"↓",
    scroll_down_size:30,

    /* MOBILE */
    mobile_hero_gap:0,
    mobile_header_height:68,
    mobile_side_padding:16,
    mobile_hero_title_size:52,
    mobile_hero_title_size_small:52,
    mobile_hero_description_size:14,
    mobile_hero_description_size_small:14,
    mobile_hero_visual_height:245,
    mobile_hero_padding_top:72,
    mobile_hero_padding_bottom:8,
    mobile_brand_size:180,
    mobile_brand_spacing:-18,
    mobile_brand_name_size:35,
    mobile_brand_name_spacing:9,
    mobile_section_padding:64,
    mobile_portfolio_image_height:250,
    mobile_portfolio_image_height_small:210,
    mobile_contact_padding:22,
    mobile_button_height:52,
    mobile_button_gap:10
  };

  const px = v => typeof v === "number" ? v + "px" : v;
  const parse = v =>
    typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v.trim())
      ? Number(v)
      : v;

  let current = {...D};

  function set(doc, selector, property, value){
    doc.querySelectorAll(selector).forEach(el => {
      el.style.setProperty(property, value, "important");
    });
  }

  function apply(settings){
    current = {...D, ...settings};

    applyContent(current);

    const doc = document;
    const root = doc.documentElement;
    const q = selector => doc.querySelector(selector);

    root.style.setProperty("--gold", current.color_gold);
    root.style.setProperty("--gold-light", current.color_gold_light);
    root.style.setProperty("--gold-dark", current.color_gold_dark);
    root.style.setProperty("--black", current.color_black);
    root.style.setProperty("--dark", current.color_dark);
    root.style.setProperty("--dark-card", current.color_dark_card);
    root.style.setProperty("--dark-card-2", current.color_dark_card_2);
    root.style.setProperty("--white", current.color_white);
    root.style.setProperty("--text", current.color_text);
    root.style.setProperty("--muted", current.color_muted);
    root.style.setProperty("--container", px(current.container_width));

    if(q(".brand-f")) q(".brand-f").textContent = current.brand_letter_1;
    if(q(".brand-k")) q(".brand-k").textContent = current.brand_letter_2;
    if(q(".hero-brand-name")) q(".hero-brand-name").textContent = current.brand_name;

    const brandItems = [
      current.brands_item_1,
      current.brands_item_2,
      current.brands_item_3,
      current.brands_item_4,
      current.brands_item_5,
      current.brands_item_6
    ];

    doc.querySelectorAll(".brands-container span").forEach((el, i) => {
      if(brandItems[i] !== undefined) el.textContent = brandItems[i];
    });

    const scrollDown = q(".scroll-down");
    if(scrollDown){
      scrollDown.textContent = current.scroll_down_symbol;
      scrollDown.style.fontSize = px(current.scroll_down_size);
    }

    set(doc, ".site-header", "height", px(current.header_height));
    set(
      doc,
      ".header-container,.section-container,.footer-container,.hero-container",
      "width",
      "min(" + px(current.container_width) + ", calc(100% - " + px(current.side_padding * 2) + "))"
    );

    set(doc, ".site-logo", "font-size", px(current.logo_font_size));
    set(doc, ".site-logo", "gap", px(current.logo_gap));
    set(doc, ".main-nav", "gap", px(current.nav_gap));
    set(doc, ".nav-link", "font-size", px(current.nav_font_size));
    set(doc, ".header-contact-button", "width", px(current.header_button_width));
    set(doc, ".header-contact-button", "height", px(current.header_button_height));
    set(doc, ".header-contact-button", "border-radius", px(current.header_button_radius));
    set(doc, ".header-contact-button", "font-size", px(current.header_button_font_size));

    set(doc, ".hero-brands", "min-height", px(current.brands_height));
    set(doc, ".brands-container", "gap", px(current.brands_gap));
    set(doc, ".brands-container span", "font-size", px(current.brands_font_size));
    set(doc, ".brands-container span", "letter-spacing", px(current.brands_letter_spacing));
    set(doc, ".scroll-down", "font-size", px(current.scroll_down_size));

    set(doc, ".hero-container", "gap", px(current.hero_gap));
    set(doc, ".hero-content", "max-width", px(current.hero_content_max_width));
    set(
      doc,
      ".hero-content",
      "padding",
      px(current.hero_content_padding_top) + " 0 " + px(current.hero_content_padding_bottom)
    );
    set(doc, ".hero-small-text", "font-size", px(current.hero_small_font_size));
    set(doc, ".hero-small-text", "letter-spacing", px(current.hero_small_letter_spacing));
    set(doc, ".hero-title", "font-size", px(current.hero_title_font_size));
    set(doc, ".hero-title", "line-height", current.hero_title_line_height);
    set(doc, ".hero-title", "letter-spacing", px(current.hero_title_letter_spacing));
    set(doc, ".hero-description", "font-size", px(current.hero_description_font_size));
    set(doc, ".hero-description", "max-width", px(current.hero_description_max_width));
    set(doc, ".hero-description", "line-height", current.hero_description_line_height);
    set(doc, ".hero-buttons", "gap", px(current.hero_buttons_gap));
    set(doc, ".primary-button,.secondary-button", "height", px(current.hero_button_height));
    set(doc, ".primary-button,.secondary-button", "padding-left", px(current.hero_button_padding));
    set(doc, ".primary-button,.secondary-button", "padding-right", px(current.hero_button_padding));
    set(doc, ".primary-button,.secondary-button", "gap", px(current.hero_button_gap));
    set(doc, ".primary-button,.secondary-button", "border-radius", px(current.hero_button_radius));
    set(doc, ".primary-button,.secondary-button", "font-size", px(current.hero_button_font_size));
    set(doc, ".hero-gold-glow", "width", px(current.hero_gold_glow_size));
    set(doc, ".hero-gold-glow", "height", px(current.hero_gold_glow_size));

    set(doc, ".hero-brand-main", "font-size", px(current.brand_font_size));
    set(doc, ".hero-brand-main", "gap", px(current.brand_gap));
    set(doc, ".hero-brand-main", "letter-spacing", px(current.brand_letter_spacing));
    set(doc, ".hero-brand-name", "font-size", px(current.brand_name_font_size));
    set(doc, ".hero-brand-name", "letter-spacing", px(current.brand_name_letter_spacing));
    set(doc, ".hero-brand-name", "margin-top", px(current.brand_name_margin_top));
    set(doc, ".brand-line", "width", current.brand_line_width + "%");
    set(doc, ".brand-line", "height", px(current.brand_line_height));
    set(doc, ".brand-line", "margin-top", px(current.brand_line_margin_top));
    set(doc, ".brand-glow", "width", px(current.brand_glow_size));
    set(doc, ".brand-glow", "height", px(current.brand_glow_size));
    set(doc, ".brand-glow", "filter", "blur(" + px(current.brand_glow_blur) + ")");

    set(doc, ".portfolio-section,.about-section,.services-section", "padding-top", px(current.section_padding));
    set(doc, ".portfolio-section,.about-section,.services-section", "padding-bottom", px(current.section_padding));
    set(doc, ".section-heading", "gap", px(current.section_heading_gap));
    set(doc, ".section-heading", "margin-bottom", px(current.section_heading_margin_bottom));
    set(doc, ".section-heading h2", "font-size", px(current.section_title_font_size));
    set(doc, ".section-heading h2", "letter-spacing", px(current.section_title_letter_spacing));
    set(doc, ".portfolio-slider", "grid-template-columns", "repeat(" + current.portfolio_columns + ",1fr)");
    set(doc, ".portfolio-slider", "gap", px(current.portfolio_gap));
    set(doc, ".portfolio-card", "border-radius", px(current.portfolio_radius));
    set(doc, ".portfolio-image", "height", px(current.portfolio_image_height));
    set(doc, ".portfolio-info", "padding", px(current.portfolio_info_padding));
    set(doc, ".slider-arrow", "width", px(current.slider_arrow_size));
    set(doc, ".slider-arrow", "height", px(current.slider_arrow_size));
    set(doc, ".about-grid", "gap", px(current.about_gap));
    set(doc, ".about-content p", "font-size", px(current.about_text_font_size));
    set(doc, ".about-content p", "line-height", current.about_text_line_height);
    set(doc, ".services-grid", "gap", px(current.services_gap));
    set(doc, ".services-grid", "grid-template-columns", "repeat(" + current.service_columns + ",1fr)");
    set(doc, ".service-card", "padding", px(current.service_card_padding));
    set(doc, ".service-card", "border-radius", px(current.service_card_radius));
    set(doc, ".service-card", "min-height", px(current.service_card_min_height));
    set(doc, ".service-card", "gap", px(current.service_card_gap));
    set(doc, ".service-icon", "width", px(current.service_icon_size));
    set(doc, ".service-icon", "height", px(current.service_icon_size));
    set(doc, ".contact-section", "padding-top", px(current.contact_section_padding));
    set(doc, ".contact-section", "padding-bottom", px(current.contact_section_padding));
    set(doc, ".contact-box", "padding", px(current.contact_padding));
    set(doc, ".contact-box", "gap", px(current.contact_gap));
    set(doc, ".contact-box", "border-radius", px(current.contact_radius));
    set(doc, ".contact-link", "min-height", px(current.contact_link_height));
    set(doc, ".contact-link", "padding-left", px(current.contact_link_padding));
    set(doc, ".contact-link", "padding-right", px(current.contact_link_padding));
    set(doc, ".contact-content h2", "font-size", px(current.contact_title_font_size));
    set(doc, ".contact-content p", "font-size", px(current.contact_text_font_size));
    set(doc, ".site-footer", "padding-top", px(current.footer_padding));
    set(doc, ".site-footer", "padding-bottom", px(current.footer_padding));

    let style = doc.getElementById("fkDesignRuntimeStyle");

    if(!style){
      style = doc.createElement("style");
      style.id = "fkDesignRuntimeStyle";
      doc.head.appendChild(style);
    }

    style.textContent = `
      /* TABLET */
      @media (max-width:1100px){
        .portfolio-slider{
          grid-template-columns:repeat(${current.portfolio_columns_tablet},1fr)!important;
        }

        .hero-container{
          gap:${px(current.mobile_hero_gap)}!important;
          min-height:auto!important;
        }

        .hero-content{
          max-width:760px!important;
        }

        .hero-brand-main{
          font-size:min(${px(Math.min(current.mobile_brand_size,260))},48vw)!important;
        }

        .hero-brand-name{
          font-size:min(${px(current.mobile_brand_name_size)},12vw)!important;
          letter-spacing:${px(current.mobile_brand_name_spacing)}!important;
        }

        .hero-visual{
          min-height:${px(current.mobile_hero_visual_height)}!important;
        }
      }

      /* MOBILE */
      @media (max-width:800px){
        html,body{
          max-width:100%;
          overflow-x:hidden!important;
        }

        .site-header{
          height:${px(current.mobile_header_height)}!important;
        }

        .header-container,
        .section-container,
        .footer-container,
        .hero-container{
          width:calc(100% - ${px(current.mobile_side_padding * 2)})!important;
          max-width:100%!important;
        }

        .site-logo{
          font-size:18px!important;
          letter-spacing:1px!important;
          gap:5px!important;
        }

        .mobile-menu{
          top:${px(current.mobile_header_height)}!important;
          padding:10px 16px 18px!important;
        }

        .mobile-nav-link{
          padding:14px 12px!important;
          font-size:14px!important;
        }

        .hero-section{
          min-height:auto!important;
          padding-top:${px(current.mobile_header_height)}!important;
        }

        .hero-container{
          min-height:auto!important;
          grid-template-columns:1fr!important;
          gap:0!important;
        }

        .hero-content{
          padding-top:${px(current.mobile_hero_padding_top)}!important;
          padding-bottom:${px(current.mobile_hero_padding_bottom)}!important;
          max-width:760px!important;
        }

        .hero-small-text{
          margin-bottom:16px!important;
          font-size:9px!important;
          letter-spacing:2.5px!important;
          line-height:1.5!important;
        }

        .hero-title{
          font-size:min(${px(current.mobile_hero_title_size)},12vw)!important;
          line-height:.94!important;
          letter-spacing:-2.5px!important;
          margin-bottom:20px!important;
        }

        .hero-description{
          max-width:620px!important;
          margin:0 auto 24px!important;
          font-size:${px(current.mobile_hero_description_size)}!important;
          line-height:1.65!important;
        }

        .hero-buttons{
          width:100%!important;
          justify-content:center!important;
          gap:${px(current.mobile_button_gap)}!important;
        }

        .primary-button,
        .secondary-button{
          min-height:${px(current.mobile_button_height)}!important;
          height:${px(current.mobile_button_height)}!important;
          padding-left:18px!important;
          padding-right:18px!important;
          gap:12px!important;
          font-size:12px!important;
        }

        .hero-visual{
          min-height:${px(current.mobile_hero_visual_height)}!important;
          height:${px(current.mobile_hero_visual_height)}!important;
        }

        .hero-brand-main{
          font-size:min(${px(current.mobile_brand_size)},44vw)!important;
          letter-spacing:${px(current.mobile_brand_spacing)}!important;
          line-height:.72!important;
        }

        .hero-brand-name{
          margin-top:18px!important;
          font-size:min(${px(current.mobile_brand_name_size)},9vw)!important;
          letter-spacing:${px(current.mobile_brand_name_spacing)}!important;
          padding-left:${px(current.mobile_brand_name_spacing)}!important;
        }

        .brand-line{
          width:62%!important;
          margin-top:20px!important;
        }

        .brand-glow{
          width:min(300px,78vw)!important;
          height:min(300px,78vw)!important;
          filter:blur(12px)!important;
        }

        .hero-gold-glow{
          width:min(340px,90vw)!important;
          height:min(340px,90vw)!important;
          top:22%!important;
          right:5%!important;
        }

        .hero-brands{
          position:relative!important;
          height:72px!important;
          min-height:72px!important;
          margin-top:8px!important;
        }

        .brands-container{
          height:100%!important;
          display:grid!important;
          grid-template-columns:repeat(3,minmax(0,1fr))!important;
          grid-template-rows:repeat(2,1fr)!important;
          gap:4px 10px!important;
          padding:6px 0!important;
          overflow:hidden!important;
          justify-content:initial!important;
        }

        .brands-container span{
          min-width:0!important;
          white-space:nowrap!important;
          text-align:center!important;
          font-size:8px!important;
          letter-spacing:1px!important;
        }

        .scroll-down{
          display:none!important;
        }

        .portfolio-section,
        .about-section,
        .services-section{
          padding-top:${px(current.mobile_section_padding)}!important;
          padding-bottom:${px(current.mobile_section_padding)}!important;
        }

        .section-heading{
          margin-bottom:28px!important;
        }

        .section-heading h2,
        .about-heading h2{
          font-size:clamp(30px,8vw,42px)!important;
          line-height:1.05!important;
          letter-spacing:-1.5px!important;
        }

        .section-heading > p{
          margin-top:14px!important;
          font-size:13px!important;
          line-height:1.65!important;
        }

        .portfolio-slider{
          grid-template-columns:1fr!important;
          gap:14px!important;
        }

        .portfolio-image{
          height:${px(current.mobile_portfolio_image_height)}!important;
        }

        .portfolio-info{
          padding:16px!important;
        }

        .portfolio-info h3{
          font-size:17px!important;
        }

        .portfolio-info p{
          font-size:12px!important;
          line-height:1.6!important;
        }

        .slider-arrow{
          width:42px!important;
          height:42px!important;
          font-size:17px!important;
          top:calc(${px(current.mobile_portfolio_image_height)} / 2)!important;
        }

        .slider-prev{
          left:8px!important;
        }

        .slider-next{
          right:8px!important;
        }

        .portfolio-dots{
          margin-top:22px!important;
        }

        .about-grid{
          gap:24px!important;
        }

        .about-content{
          padding-top:0!important;
        }

        .about-content p{
          font-size:14px!important;
          line-height:1.75!important;
        }

        .about-stats{
          margin-top:48px!important;
          gap:18px!important;
        }

        .about-stat{
          min-height:auto!important;
          padding:0 0 20px!important;
          gap:16px!important;
        }

        .stat-icon{
          min-width:48px!important;
          width:48px!important;
          height:48px!important;
          font-size:18px!important;
        }

        .about-stat h3{
          font-size:14px!important;
        }

        .about-stat p{
          font-size:12px!important;
          line-height:1.6!important;
        }

        .services-grid{
          grid-template-columns:1fr!important;
          gap:14px!important;
        }

        .service-card{
          min-height:0!important;
          padding:22px!important;
          gap:18px!important;
        }

        .service-icon{
          min-width:52px!important;
          width:52px!important;
          height:52px!important;
          font-size:21px!important;
        }

        .service-card h3{
          font-size:16px!important;
          margin-bottom:7px!important;
        }

        .service-card p{
          font-size:12px!important;
          line-height:1.6!important;
        }

        .contact-section{
          padding-top:70px!important;
          padding-bottom:70px!important;
        }

        .contact-box{
          padding:${px(current.mobile_contact_padding)}!important;
          gap:24px!important;
          border-radius:12px!important;
        }

        .contact-small-title{
          margin-bottom:12px!important;
          font-size:9px!important;
          letter-spacing:3px!important;
        }

        .contact-content h2{
          font-size:clamp(30px,8vw,42px)!important;
          line-height:1.08!important;
          margin-bottom:14px!important;
        }

        .contact-content p{
          font-size:13px!important;
          line-height:1.65!important;
        }

        .contact-links{
          grid-template-columns:1fr!important;
        }

        .contact-link{
          min-height:76px!important;
          padding:16px 0!important;
          gap:12px!important;
          border-left:none!important;
          border-top:1px solid var(--line)!important;
        }

        .contact-link:first-child{
          border-top:none!important;
        }

        .contact-icon{
          min-width:38px!important;
          width:38px!important;
          height:38px!important;
          font-size:22px!important;
        }

        .contact-link strong{
          font-size:12px!important;
        }

        .footer-container{
          gap:14px!important;
          padding-bottom:10px!important;
        }

        .footer-top{
          position:absolute!important;
          right:16px!important;
        }
      }

      /* SMALL PHONES */
      @media (max-width:500px){
        .hero-title{
          font-size:min(${px(current.mobile_hero_title_size_small)},13vw)!important;
        }

        .hero-description{
          font-size:${px(current.mobile_hero_description_size_small)}!important;
        }

        .hero-buttons{
          flex-direction:column!important;
        }

        .primary-button,
        .secondary-button{
          width:100%!important;
        }

        .hero-visual{
          min-height:225px!important;
          height:225px!important;
        }

        .hero-brand-main{
          font-size:min(${px(current.mobile_brand_size)},43vw)!important;
        }

        .portfolio-image{
          height:${px(current.mobile_portfolio_image_height_small)}!important;
        }

        .slider-arrow{
          top:calc(${px(current.mobile_portfolio_image_height_small)} / 2)!important;
        }

        .section-small-title{
          font-size:9px!important;
          letter-spacing:3px!important;
        }

        .lightbox{
          padding:12px!important;
        }

        .lightbox-close{
          top:12px!important;
          right:12px!important;
          width:44px!important;
          height:44px!important;
          font-size:28px!important;
        }
      }
    `;
  }

  function esc(v){
    return String(v ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;");
  }

  function text(doc, selector, value){
    doc.querySelectorAll(selector).forEach(el => {
      el.textContent = value ?? "";
    });
  }

  function applyContent(s){
    const doc = document;

    if(s.content_page_title){
      doc.title = s.content_page_title;
    }

    const meta = doc.querySelector('meta[name="description"]');

    if(meta && s.content_meta_description){
      meta.setAttribute("content", s.content_meta_description);
    }

    text(doc, ".site-logo strong", s.content_logo_first);
    text(doc, ".site-logo span", s.content_logo_second);

    const nav = [
      s.content_nav_1,
      s.content_nav_2,
      s.content_nav_3,
      s.content_nav_4
    ];

    doc.querySelectorAll(".main-nav .nav-link, .mobile-nav-link")
      .forEach((el,i) => {
        if(nav[i % 4] !== undefined){
          el.textContent = nav[i % 4];
        }
      });

    text(doc, ".header-contact-button", s.content_header_contact);
    text(doc, ".hero-small-text", s.content_hero_small);

    const hero = doc.querySelector(".hero-title");

    if(hero){
      hero.innerHTML =
        esc(s.content_hero_title_1) +
        " <span>" +
        esc(s.content_hero_title_highlight) +
        "</span> " +
        esc(s.content_hero_title_2) +
        " <strong>" +
        esc(s.content_hero_title_strong) +
        "</strong>";
    }

    text(doc, ".hero-description", s.content_hero_description);
    text(doc, ".primary-button span", s.content_hero_button_1);
    text(doc, ".secondary-button span", s.content_hero_button_2);

    text(doc, ".portfolio-section .section-small-title", s.content_portfolio_small);
    text(doc, ".portfolio-section .section-heading h2", s.content_portfolio_title);
    text(doc, ".portfolio-section .section-heading > p", s.content_portfolio_description);
    text(doc, ".portfolio-loading", s.content_portfolio_loading);

    text(doc, ".about-heading .section-small-title", s.content_about_small);

    const aboutTitle = doc.querySelector(".about-heading h2");

    if(aboutTitle){
      aboutTitle.innerHTML =
        esc(s.content_about_title_1) +
        "<br>" +
        esc(s.content_about_title_2);
    }

    text(doc, "#aboutText", s.content_about_text);

    [1,2,3].forEach(i => {
      text(doc, `.about-stat:nth-child(${i}) strong`, s[`content_stat_${i}_number`]);
      text(doc, `.about-stat:nth-child(${i}) h3`, s[`content_stat_${i}_title`]);
      text(doc, `.about-stat:nth-child(${i}) p`, s[`content_stat_${i}_text`]);
    });

    text(doc, ".services-heading .section-small-title", s.content_services_small);
    text(doc, ".services-heading h2", s.content_services_title);

    [1,2,3].forEach(i => {
      text(doc, `.service-card:nth-child(${i}) h3`, s[`content_service_${i}_title`]);
      text(doc, `.service-card:nth-child(${i}) p`, s[`content_service_${i}_text`]);
    });

    text(doc, ".contact-small-title", s.content_contact_small);
    text(doc, ".contact-content h2", s.content_contact_title);
    text(doc, ".contact-content p", s.content_contact_text);

    const labels = [
      s.content_email_label,
      s.content_whatsapp_label,
      s.content_instagram_label
    ];

    doc.querySelectorAll(".contact-link-label").forEach((el,i) => {
      el.textContent = labels[i] || "";
    });

    const footer = doc.querySelector(".site-footer p");

    if(footer){
      footer.innerHTML =
        '© <span id="currentYear"></span> ' +
        esc(s.content_footer_text);

      const year = doc.querySelector("#currentYear");

      if(year){
        year.textContent = new Date().getFullYear();
      }
    }
  }

  async function load(){
    if(!client) return;

    try{
      const [designResult, contentResult] = await Promise.all([
        client
          .from("site_settings")
          .select("setting_key,setting_value")
          .like("setting_key","design_%"),

        client
          .from("site_settings")
          .select("setting_key,setting_value")
          .like("setting_key","content_%")
      ]);

      if(designResult.error) throw designResult.error;
      if(contentResult.error) throw contentResult.error;

      const settings = {};

      [
        ...(designResult.data || []),
        ...(contentResult.data || [])
      ].forEach(x => {
        if(!x.setting_key) return;

        const key = x.setting_key.startsWith("content_")
          ? x.setting_key
          : x.setting_key.replace(/^design_/,"");

        settings[key] = parse(x.setting_value);
      });

      apply(settings);

    }catch(error){
      console.warn("Tasarım/İçerik ayarları yüklenemedi", error);
    }
  }

  window.addEventListener("message", event => {
    if(
      event.data?.type === "fk-design-preview" &&
      event.data.settings
    ){
      apply(event.data.settings);
    }
  });

  load();

})();
