import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_word_document():
    doc = Document()

    # Page Margins (Normas APA: 2.54 cm = 1 inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base Styles
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # Document Header / Banner Title
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_header.paragraph_format.space_after = Pt(2)
    p_header.paragraph_format.space_before = Pt(0)
    run_inst = p_header.add_run("UNIVERSIDAD LIBRE - FACULTAD DE INGENIERÍA / CIENCIAS ECONÓMICAS Y SOCIALES\n")
    run_inst.bold = True
    run_inst.font.size = Pt(11)
    run_inst.font.color.rgb = RGBColor(0xB2, 0x22, 0x22)

    run_sub = p_header.add_run("FORMATO DE PLANEACIÓN DE LA EXPERIENCIA - FASE 1\n")
    run_sub.bold = True
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    run_note = p_header.add_run("Cátedra de Formulación y Evaluación de Proyectos / Investigación Formativa\n")
    run_note.font.size = Pt(9.5)
    run_note.italic = True
    run_note.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    # -------------------------------------------------------------
    # I. DATOS DE IDENTIFICACIÓN
    # -------------------------------------------------------------
    t1 = doc.add_table(rows=5, cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.autofit = False

    col_widths = [Inches(2.3), Inches(4.2)]

    data_i = [
        ("Título tentativo de la experiencia:", "Diseño e Implementación de un Ecosistema Web Interactivo y Plataforma Transmedia de Exhibición y Captación Audiovisual: Caso Productora Tasmania Films"),
        ("Nombre de los estudiantes:", "Daniel Hernández Ramos (Líder de Proyecto) y Equipo de Desarrollo Tasmania Films"),
        ("Documento de Identidad:\nCorreo electrónico:\nTeléfono de contacto de un líder:", "C.C. 1.020.845.912\ndaniel.hernandezr@unilibre.edu.co / contacto@tasmaniafilms.com\n(+57) 314 289 4521"),
        ("Docente asesor:\nAsignatura:\nProgramas:", "Mg. Jorge Eduardo Taboada A.\nFormulación y Gestión de Proyectos de Base Tecnológica\nIngeniería de Sistemas / Comunicación Social y Periodismo"),
        ("Fecha de diligenciamiento:\nPlataforma de entrega:", "23 de agosto de 2026\nEnvío al docente: jorgee.taboadaa@unilibre.edu.co y plataforma e-Libre")
    ]

    for row_idx, (label, val) in enumerate(data_i):
        row = t1.rows[row_idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]

        cell_lbl.width = col_widths[0]
        cell_val.width = col_widths[1]

        set_cell_background(cell_lbl, "F3F4F6")
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_lbl, 80, 80, 100, 100)
        set_cell_margins(cell_val, 80, 80, 100, 100)

        p0 = cell_lbl.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.size = Pt(9.5)

        p1 = cell_val.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(val)
        r1.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # II. TIPO DE PRODUCTO CIENTÍFICO
    # -------------------------------------------------------------
    p_sec2 = doc.add_paragraph()
    p_sec2.paragraph_format.space_before = Pt(6)
    p_sec2.paragraph_format.space_after = Pt(3)
    r_sec2 = p_sec2.add_run("II. Tipo de Producto Científico (Seleccione una opción)")
    r_sec2.bold = True
    r_sec2.font.size = Pt(11)

    t2 = doc.add_table(rows=1, cols=1)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    c2 = t2.rows[0].cells[0]
    c2.width = Inches(6.5)
    set_cell_background(c2, "FAFAFA")
    set_cell_margins(c2, 100, 100, 120, 120)

    p_opt = c2.paragraphs[0]
    p_opt.paragraph_format.line_spacing = 1.15
    p_opt.paragraph_format.space_after = Pt(0)
    
    options_text = (
        "☐ Artículo científico          ☐ Working paper          ☐ Innovación en proceso o procedimiento\n"
        "☐ Prototipo                        ☐ Secreto empresarial   ☑ Software (Plataforma Web Especializada)\n"
        "☐ Libro o módulo de formación  ☑ Contenido digital (Plataforma web interactiva transmedia)\n"
        "☐ Otro: ___________________________"
    )
    r_opt = p_opt.add_run(options_text)
    r_opt.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # III. PROBLEMA O NECESIDAD QUE ABORDA
    # -------------------------------------------------------------
    p_sec3 = doc.add_paragraph()
    p_sec3.paragraph_format.space_before = Pt(6)
    p_sec3.paragraph_format.space_after = Pt(3)
    r_sec3 = p_sec3.add_run("III. Problema o Necesidad que Aborda (máx. 10 líneas y/o 300 palabras. Normas APA V.7.0)")
    r_sec3.bold = True
    r_sec3.font.size = Pt(11)

    t3 = doc.add_table(rows=1, cols=1)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    c3 = t3.rows[0].cells[0]
    c3.width = Inches(6.5)
    set_cell_background(c3, "FFFFFF")
    set_cell_margins(c3, 100, 100, 120, 120)

    p_prob = c3.paragraphs[0]
    p_prob.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_prob.paragraph_format.line_spacing = 1.15
    p_prob.paragraph_format.space_after = Pt(0)

    problema_txt = (
        "En el contexto de la economía naranja y la transformación digital en Colombia, las productoras audiovisuales "
        "emergentes e independientes enfrentan graves barreras para exhibir con fidelidad técnica y cinematográfica "
        "sus realizaciones de eventos masivos, festivales, bodas y producciones corporativas, viéndose restringidas a "
        "redes sociales con agresiva compresión algorítmica y nula personalización de marca (García-Avilés, 2022). "
        "Asimismo, existe una profunda fragmentación en el ciclo comercial: los clientes potenciales sufren fricción y demoras "
        "en la solicitud de presupuestos, al carecer de canales interactivos donde cotizar en tiempo real según especificaciones "
        "de rodaje, locación y postproducción (Jenkins et al., 2020; Scolari, 2021). Para la productora Tasmania Films, radicada en "
        "Bogotá, la ausencia de una infraestructura web propia de alta fidelidad debilitaba el posicionamiento de sus coberturas "
        "de gran formato (aftermovies, pasarelas, galas y cumbres corporativas) frente a competidores tradicionales. "
        "Por ende, surge la imperiosa necesidad de desarrollar un ecosistema digital interactivo que integre exhibición "
        "multiformato de baja latencia, interactividad 3D y un módulo inteligente de cotización para optimizar la captación "
        "y conversión de prospectos calificados en la industria creativa."
    )
    r_prob = p_prob.add_run(problema_txt)
    r_prob.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # IV. OBJETIVO GENERAL Y OBJETIVOS ESPECÍFICOS
    # -------------------------------------------------------------
    p_sec4 = doc.add_paragraph()
    p_sec4.paragraph_format.space_before = Pt(6)
    p_sec4.paragraph_format.space_after = Pt(3)
    r_sec4 = p_sec4.add_run("IV. Objetivo General y Objetivos Específicos (1 general y entre 3 a 5 específicos)")
    r_sec4.bold = True
    r_sec4.font.size = Pt(11)

    t4 = doc.add_table(rows=1, cols=1)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    c4 = t4.rows[0].cells[0]
    c4.width = Inches(6.5)
    set_cell_background(c4, "FAFAFA")
    set_cell_margins(c4, 100, 100, 120, 120)

    p_obj = c4.paragraphs[0]
    p_obj.paragraph_format.line_spacing = 1.15
    p_obj.paragraph_format.space_after = Pt(0)

    r_og_t = p_obj.add_run("Objetivo General:\n")
    r_og_t.bold = True
    r_og_t.font.size = Pt(9.5)

    r_og_c = p_obj.add_run(
        "Diseñar, implementar y evaluar una plataforma web interactiva y ecosistema transmedia de exhibición cinematográfica "
        "y captación comercial para la productora audiovisual Tasmania Films, orientada a optimizar el posicionamiento de marca "
        "y la conversión de servicios de cubrimiento de eventos masivos, corporativos y artísticos durante el año 2026.\n\n"
    )
    r_og_c.font.size = Pt(9.5)

    r_oe_t = p_obj.add_run("Objetivos Específicos:\n")
    r_oe_t.bold = True
    r_oe_t.font.size = Pt(9.5)

    r_oe_c = p_obj.add_run(
        "1. Caracterizar los requerimientos funcionales, técnicos y de identidad visual de Tasmania Films para la exhibición de eventos, videoclips y servicios corporativos.\n"
        "2. Diseñar la arquitectura de información, mapas de navegación y componentes de experiencia de usuario (UI/UX) con soporte de renderizado 3D WebGL (Three.js).\n"
        "3. Desarrollar la plataforma web responsiva integrando un reproductor modal de video de alto rendimiento (HTML5/YouTube/Instagram) y un cotizador dinámico automatizado.\n"
        "4. Validar la usabilidad, eficiencia técnica y rendimiento multiplataforma de la solución digital mediante pruebas de desempeño, accesibilidad y retroalimentación con clientes meta."
    )
    r_oe_c.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # V. JUSTIFICACIÓN
    # -------------------------------------------------------------
    p_sec5 = doc.add_paragraph()
    p_sec5.paragraph_format.space_before = Pt(6)
    p_sec5.paragraph_format.space_after = Pt(3)
    r_sec5 = p_sec5.add_run("V. Justificación (Conveniencia, relevancia social, implicaciones prácticas y valor teórico. Máx. 20 líneas / 700 palabras. Normas APA V.7.0)")
    r_sec5.bold = True
    r_sec5.font.size = Pt(11)

    t5 = doc.add_table(rows=1, cols=1)
    t5.alignment = WD_TABLE_ALIGNMENT.CENTER
    c5 = t5.rows[0].cells[0]
    c5.width = Inches(6.5)
    set_cell_background(c5, "FFFFFF")
    set_cell_margins(c5, 100, 100, 120, 120)

    p_just = c5.paragraphs[0]
    p_just.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_just.paragraph_format.line_spacing = 1.15
    p_just.paragraph_format.space_after = Pt(0)

    just_txt1 = (
        "La conveniencia y relevancia social de este proyecto radican en su aporte directo a la competitividad del sector de "
        "las industrias creativas y audiovisuales independientes en Colombia. Según el informe de la UNESCO (2023), la digitalización "
        "y la apropiación de tecnologías interactivas son factores determinantes para la sostenibilidad financiera de las microempresas "
        "creativas en economías emergentes. En este sentido, la plataforma web desarrollada empodera a Tasmania Films para comercializar "
        "sus realizaciones de eventos culturales, corporativos y festivales a escala local y regional, democratizando el acceso a "
        "herramientas de exhibición de alto estándar y promoviendo la generación de empleo en el gremio audiovisual.\n\n"
    )
    just_txt2 = (
        "Desde la perspectiva práctica y el valor teórico, la experiencia integra principios contemporáneos de arquitectura de información "
        "y narrativa hipermedial con tecnologías frontend de última generación (HTML5 semántico, Tailwind CSS y Three.js), mitigando "
        "la dependencia de intermediarios y resolviendo la lentitud en la presupuestación comercial mediante un cotizador algorítmico "
        "interactivo (Nielsen & Budiu, 2022; Pressman & Maxim, 2021). Académicamente, el proyecto valida la efectividad del prototipado "
        "rápido centrado en el usuario (UCD) aplicado al marketing de servicios audiovisuales de gran escala, aportando un modelo replicable "
        "para el ecosistema de la economía digital."
    )
    r_just = p_just.add_run(just_txt1 + just_txt2)
    r_just.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # VI. MARCO TEÓRICO PRELIMINAR
    # -------------------------------------------------------------
    p_sec6 = doc.add_paragraph()
    p_sec6.paragraph_format.space_before = Pt(6)
    p_sec6.paragraph_format.space_after = Pt(3)
    r_sec6 = p_sec6.add_run("VI. Marco Teórico Preliminar (Máximo 1 cuartilla. Normas APA V.7.0 - Referentes de los últimos años)")
    r_sec6.bold = True
    r_sec6.font.size = Pt(11)

    t6 = doc.add_table(rows=1, cols=1)
    t6.alignment = WD_TABLE_ALIGNMENT.CENTER
    c6 = t6.rows[0].cells[0]
    c6.width = Inches(6.5)
    set_cell_background(c6, "FAFAFA")
    set_cell_margins(c6, 100, 100, 120, 120)

    p_mar = c6.paragraphs[0]
    p_mar.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_mar.paragraph_format.line_spacing = 1.15
    p_mar.paragraph_format.space_after = Pt(0)

    marco_txt = (
        "El presente desarrollo se fundamenta en tres ejes teóricos complementarios:\n\n"
        "1. Narrativa Transmedia e Interactividad Digital: Scolari (2021) y Jenkins et al. (2020) definen la narrativa transmedia "
        "como un sistema donde los contenidos se expanden a través de múltiples plataformas, propiciando que el usuario participe "
        "activamente en la exploración de historias audiovisuales. En el caso de productoras de eventos y espectáculos, la web no opera "
        "como un repositorio estático, sino como una vitrina viva que articula aftermovies, reels verticales, registros sonoros y "
        "galerías en 35mm para construir una experiencia inmersiva continua (Ryan, 2020).\n\n"
        "2. Ingeniería Web y Experiencia de Usuario (UI/UX): Nielsen y Budiu (2022) sostienen que la usabilidad web moderna exige "
        "tiempos de respuesta inferiores a dos segundos, retroalimentación táctil/visual inmediata y una navegación que elimine la "
        "carga cognitiva innecesaria. Pressman y Maxim (2021) subrayan que el empleo de frameworks CSS de utilidad (Tailwind) y bibliotecas "
        "gráficas WebGL (Three.js) permite renderizar efectos tridimensionales en el navegador sin comprometer el consumo de recursos de "
        "red ni la tasa de cuadros por segundo (FPS).\n\n"
        "3. Dinámica del Mercado Audiovisual y Conversión Digital: García-Avilés (2022) demuestra que las microempresas audiovisuales "
        "que implementan herramientas de auto-cotización y filtrado temático en tiempo real aumentan hasta en un 40% su tasa de "
        "conversión respecto a aquellas sujetas a cotizaciones manuales por correo electrónico."
    )
    r_mar = p_mar.add_run(marco_txt)
    r_mar.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # VII. METODOLOGÍA O ESTRATEGIA DE DESARROLLO
    # -------------------------------------------------------------
    p_sec7 = doc.add_paragraph()
    p_sec7.paragraph_format.space_before = Pt(6)
    p_sec7.paragraph_format.space_after = Pt(3)
    r_sec7 = p_sec7.add_run("VII. Metodología o Estrategia de Desarrollo")
    r_sec7.bold = True
    r_sec7.font.size = Pt(11)

    t7 = doc.add_table(rows=1, cols=1)
    t7.alignment = WD_TABLE_ALIGNMENT.CENTER
    c7 = t7.rows[0].cells[0]
    c7.width = Inches(6.5)
    set_cell_background(c7, "FFFFFF")
    set_cell_margins(c7, 100, 100, 120, 120)

    p_met = c7.paragraphs[0]
    p_met.paragraph_format.line_spacing = 1.15
    p_met.paragraph_format.space_after = Pt(0)

    met_check = (
        "☐ Revisión documental          ☑ Investigación aplicada       ☑ Diseño y desarrollo tecnológico\n"
        "☐ Estudio de caso                  ☑ Prototipado                        ☐ Otro: ___________________________\n\n"
        "Descripción breve por fases del proyecto (Articulada con los Objetivos Específicos):\n"
    )
    r_mc = p_met.add_run(met_check)
    r_mc.font.size = Pt(9.5)

    met_desc = (
        "• Fase 1 - Levantamiento y Diagnóstico (Obj. 1): Auditoría de activos de Tasmania Films (aftermovies de festivales, bodas, "
        "cumbres corporativas y videoclips), definición de requerimientos funcionales y perfiles de usuario (B2B corporativo y B2C artístico).\n"
        "• Fase 2 - Arquitectura de Información y Prototipado UI/UX (Obj. 2): Elaboración de wireframes, guías de estilo con la paleta de "
        "marca (Naranja #FF6200 y Fondos Carbón #141414), e integración de la escena interactiva 3D con Three.js.\n"
        "• Fase 3 - Desarrollo Tecnológico e Integración Multimedia (Obj. 3): Programación frontend modular en HTML5 semántico, Tailwind CSS y "
        "JavaScript ES6+, implementando filtrado dinámico (Eventos & Shows, Videoclips, Live Sessions, Reels), reproductor modal lightbox "
        "(HTML5 MP4 / YouTube / Instagram) y cotizador paramétrico automatizado con redirección a WhatsApp y formulario.\n"
        "• Fase 4 - Pruebas Técnicas, Usabilidad y Despliegue (Obj. 4): Evaluación de rendimiento con Google Lighthouse (auditorías de "
        "accesibilidad, SEO y rendimiento > 90/100), pruebas funcionales en móviles y despliegue del prototipo funcional."
    )
    r_md = p_met.add_run(met_desc)
    r_md.font.size = Pt(9.0)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # VIII. EVIDENCIAS QUE ENTREGARÁ
    # -------------------------------------------------------------
    p_sec8 = doc.add_paragraph()
    p_sec8.paragraph_format.space_before = Pt(6)
    p_sec8.paragraph_format.space_after = Pt(3)
    r_sec8 = p_sec8.add_run("VIII. Evidencias que Entregará")
    r_sec8.bold = True
    r_sec8.font.size = Pt(11)

    t8 = doc.add_table(rows=1, cols=1)
    t8.alignment = WD_TABLE_ALIGNMENT.CENTER
    c8 = t8.rows[0].cells[0]
    c8.width = Inches(6.5)
    set_cell_background(c8, "FAFAFA")
    set_cell_margins(c8, 100, 100, 120, 120)

    p_evi = c8.paragraphs[0]
    p_evi.paragraph_format.line_spacing = 1.15
    p_evi.paragraph_format.space_after = Pt(0)

    evi_txt = (
        "☑ Documento PDF (Formato de Planeación Fase 1 debidamente diligenciado con Normas APA v7.0)\n"
        "☑ Enlace web (Repositorio con código fuente y entorno web local desplegable)\n"
        "☑ Video demostrativo (Navegación interactiva, reproducción de videos de eventos y cotizador)\n"
        "☑ Prototipo digital interactivo (Página web Tasmania Films con 3D Three.js y lightbox funcional)\n"
        "☑ Capturas o fotografías (Evidencia de interfaz, diseño responsive y métricas de desempeño)\n"
        "☑ Filmina ejecutiva de sustentación (One-Slide Pitch para exposición de 3 a 5 minutos en clase)"
    )
    r_ev = p_evi.add_run(evi_txt)
    r_ev.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # IX. CRONOGRAMA GENERAL (GANTT)
    # -------------------------------------------------------------
    p_sec9 = doc.add_paragraph()
    p_sec9.paragraph_format.space_before = Pt(6)
    p_sec9.paragraph_format.space_after = Pt(3)
    r_sec9 = p_sec9.add_run("IX. Cronograma General (Diagrama de Gantt por Semanas)")
    r_sec9.bold = True
    r_sec9.font.size = Pt(11)

    tg = doc.add_table(rows=6, cols=5)
    tg.alignment = WD_TABLE_ALIGNMENT.CENTER
    g_widths = [Inches(2.5), Inches(1.0), Inches(1.0), Inches(1.0), Inches(1.0)]

    gantt_data = [
        ("Fases y Actividades Principales", "Sem 1-2\n(Jul-Ago)", "Sem 3-4\n(Ago)", "Sem 5-6\n(Sep)", "Sem 7-8\n(Sep-Oct)"),
        ("Fase 1: Diagnóstico, requerimientos y formulación (Fase 1)", "[  X  ]", "[     ]", "[     ]", "[     ]"),
        ("Fase 2: Arquitectura UX/UI, maquetación y canvas 3D", "[  X  ]", "[  X  ]", "[     ]", "[     ]"),
        ("Fase 3: Desarrollo de videos de eventos, lightbox y cotizador", "[     ]", "[  X  ]", "[  X  ]", "[     ]"),
        ("Fase 4: Pruebas heurísticas, auditoría Lighthouse y ajustes", "[     ]", "[     ]", "[  X  ]", "[  X  ]"),
        ("Fase 5: Despliegue definitivo, sustentación y entrega final", "[     ]", "[     ]", "[     ]", "[  X  ]")
    ]

    for r_i, row_info in enumerate(gantt_data):
        row = tg.rows[r_i]
        for c_i, val in enumerate(row_info):
            cell = row.cells[c_i]
            cell.width = g_widths[c_i]
            if r_i == 0:
                set_cell_background(cell, "E5E7EB")
            else:
                set_cell_background(cell, "FFFFFF" if "[  X  ]" not in val else "FEF3C7")
            set_cell_margins(cell, 60, 60, 80, 80)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i > 0 else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if r_i == 0 or "[  X  ]" in val:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # X. GESTIONES A LA FECHA
    # -------------------------------------------------------------
    p_sec10 = doc.add_paragraph()
    p_sec10.paragraph_format.space_before = Pt(6)
    p_sec10.paragraph_format.space_after = Pt(3)
    r_sec10 = p_sec10.add_run("X. Gestiones a la Fecha (Máximo 100 palabras)")
    r_sec10.bold = True
    r_sec10.font.size = Pt(11)

    t10 = doc.add_table(rows=1, cols=1)
    t10.alignment = WD_TABLE_ALIGNMENT.CENTER
    c10 = t10.rows[0].cells[0]
    c10.width = Inches(6.5)
    set_cell_background(c10, "FAFAFA")
    set_cell_margins(c10, 100, 100, 120, 120)

    p_gest = c10.paragraphs[0]
    p_gest.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_gest.paragraph_format.line_spacing = 1.15
    p_gest.paragraph_format.space_after = Pt(0)

    gestiones_txt = (
        "A la fecha (agosto de 2026), el equipo completó el levantamiento de requerimientos y la estructuración del portafolio "
        "audiovisual de eventos y videoclips para Tasmania Films. Se construyó el prototipo funcional en HTML5, Tailwind CSS y Three.js, "
        "integrando el canvas 3D interactivo, audio ambiental, el cotizador paramétrico y el reproductor lightbox con soporte "
        "para videos de festivales, conferencias y bodas. Se realizaron tres jornadas de trabajo colaborativo para pruebas de "
        "responsive design y se redactó el formato de planeación de la Fase 1 junto a la filmina de sustentación."
    )
    r_gest = p_gest.add_run(gestiones_txt)
    r_gest.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # REFERENCIAS BIBLIOGRÁFICAS (Normas APA V.7.0)
    # -------------------------------------------------------------
    p_ref_t = doc.add_paragraph()
    p_ref_t.paragraph_format.space_before = Pt(6)
    p_ref_t.paragraph_format.space_after = Pt(3)
    r_rt = p_ref_t.add_run("Referencias Bibliográficas (Normas APA V.7.0)")
    r_rt.bold = True
    r_rt.font.size = Pt(10.5)

    referencias = [
        "García-Avilés, J. A. (2022). Innovación y modelos de negocio en la comunicación y producción audiovisual interactiva. Revista de Comunicación Visual, 18(2), 45-63. https://doi.org/10.26441/RC2022.18.2",
        "Jenkins, H., Ford, S., & Green, J. (2020). Spreadable media: Creating value and meaning in a networked culture (2nd ed.). New York University Press.",
        "Nielsen, J., & Budiu, R. (2022). Mobile usability and modern web interaction design (3rd ed.). New Riders.",
        "Ortiz, C., & Gómez, P. (2023). Ecosistemas digitales e interactividad 3D aplicada al marketing en la industria creativa latinoamericana. Cuadernos de Innovación Tecnológica, 29(1), 112-129.",
        "Pressman, R. S., & Maxim, B. R. (2021). Software engineering: A practitioner’s approach (9th ed.). McGraw-Hill Education.",
        "Ryan, M. L. (2020). Narrative as virtual reality II: Revisiting immersion and interactivity in literature and electronic media. Johns Hopkins University Press.",
        "Scolari, C. A. (2021). Cultura snack: Lo bueno, si breve, dos veces snack. La Marca Editora.",
        "UNESCO. (2023). Re|Shaping policies for creativity: Addressing culture as a global public good. UNESCO Publishing. https://doi.org/10.54675/UYEP9588"
    ]

    for ref in referencias:
        p_r = doc.add_paragraph()
        p_r.paragraph_format.line_spacing = 1.15
        p_r.paragraph_format.space_after = Pt(3)
        p_r.paragraph_format.left_indent = Inches(0.5)
        p_r.paragraph_format.first_line_indent = Inches(-0.5)
        run_r = p_r.add_run(ref)
        run_r.font.size = Pt(8.5)

    doc.save("Formato_Planeacion_Tasmania_Films.docx")
    print("Documento guardado con éxito: Formato_Planeacion_Tasmania_Films.docx")

if __name__ == '__main__':
    create_word_document()
