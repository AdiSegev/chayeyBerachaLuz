
import os, glob
from docx import Document
from docx.oxml.ns import qn

SOURCE = r'C:\Users\adi.CLOUD\Desktop\פרטי\זמני תפילות קיץ תשפו - מנין תימני.docx'

# Resolve generated file by glob
downloads = r'C:\Users\adi.CLOUD\Downloads'
matches = glob.glob(os.path.join(downloads, 'zmanim_shabbat_summer_*.docx'))
GENERATED = matches[0] if matches else None
print(f"GENERATED path: {GENERATED!r}")

def emu_to_cm(emu):
    if emu is None: return None
    return round(emu / 360000, 2)

def emu_to_inches(emu):
    if emu is None: return None
    return round(emu / 914400, 3)

def half_pt_to_pt(hp):
    if hp is None: return None
    return hp / 2

def get_font_name(run):
    rPr = run._r.find(qn('w:rPr'))
    if rPr is not None:
        rFonts = rPr.find(qn('w:rFonts'))
        if rFonts is not None:
            return (rFonts.get(qn('w:ascii')) or
                    rFonts.get(qn('w:hAnsi')) or
                    rFonts.get(qn('w:cs')) or
                    run.font.name)
    return run.font.name

def analyze_doc(path, label):
    print(f'\n{"="*60}')
    print(f'  {label}')
    print(f'{"="*60}')
    doc = Document(path)

    # --- Page layout ---
    for i, sec in enumerate(doc.sections):
        print(f'\n--- Section {i} Page Layout ---')
        print(f'  Orientation: {sec.orientation}  (0=portrait, 1=landscape)')
        print(f'  Page width:  {emu_to_cm(sec.page_width)} cm ({emu_to_inches(sec.page_width)} in)')
        print(f'  Page height: {emu_to_cm(sec.page_height)} cm ({emu_to_inches(sec.page_height)} in)')
        print(f'  Margin top:    {emu_to_cm(sec.top_margin)} cm')
        print(f'  Margin bottom: {emu_to_cm(sec.bottom_margin)} cm')
        print(f'  Margin left:   {emu_to_cm(sec.left_margin)} cm')
        print(f'  Margin right:  {emu_to_cm(sec.right_margin)} cm')
        print(f'  Header distance: {emu_to_cm(sec.header_distance)} cm')
        print(f'  Footer distance: {emu_to_cm(sec.footer_distance)} cm')

    # --- Paragraphs (non-table) ---
    print(f'\n--- Paragraphs (outside tables) ---')
    for i, para in enumerate(doc.paragraphs):
        if not para.text.strip():
            continue
        pPr = para._p.find(qn('w:pPr'))
        jc = None; bidi = None; sp_before = None; sp_after = None
        ind_left = None; ind_right = None; shd_fill = None
        if pPr is not None:
            el = pPr.find(qn('w:jc'))
            if el is not None: jc = el.get(qn('w:val'))
            el = pPr.find(qn('w:bidi'))
            if el is not None: bidi = el.get(qn('w:val'), '1')
            el = pPr.find(qn('w:spacing'))
            if el is not None:
                sp_before = el.get(qn('w:before'))
                sp_after = el.get(qn('w:after'))
            el = pPr.find(qn('w:ind'))
            if el is not None:
                ind_left = el.get(qn('w:left'))
                ind_right = el.get(qn('w:right'))
            el = pPr.find(qn('w:shd'))
            if el is not None: shd_fill = el.get(qn('w:fill'))

        fonts = set(); sizes = set(); bolds = set(); colors = set()
        for run in para.runs:
            fn = get_font_name(run)
            if fn: fonts.add(fn)
            if run.font.size: sizes.add(half_pt_to_pt(run.font.size))
            bolds.add(run.bold)
            if run.font.color and run.font.color.rgb:
                colors.add(str(run.font.color.rgb))

        style_name = para.style.name if para.style else 'None'
        print(f'  [{i}] Style={style_name} Align={jc} Bidi={bidi}')
        print(f'       Text: "{para.text[:70]}"')
        print(f'       Fonts={fonts}, Sizes={sizes}, Bolds={bolds}, Colors={colors}')
        extras = []
        if sp_before or sp_after: extras.append(f'spacing_before={sp_before} after={sp_after}')
        if ind_left or ind_right: extras.append(f'indent_left={ind_left} right={ind_right}')
        if shd_fill: extras.append(f'shd_fill={shd_fill}')
        if extras: print(f'       {"; ".join(extras)}')

    # --- Tables ---
    print(f'\n--- Tables ---')
    for ti, table in enumerate(doc.tables):
        print(f'\n  Table {ti}: {len(table.rows)} rows x {len(table.columns)} cols')

        tbl = table._tbl
        tblPr = tbl.find(qn('w:tblPr'))
        if tblPr is not None:
            tblW = tblPr.find(qn('w:tblW'))
            if tblW is not None:
                w_val = tblW.get(qn('w:w'))
                w_type = tblW.get(qn('w:type'))
                w_cm = round(int(w_val) * 2.54 / 1440, 2) if w_val and w_type == 'dxa' else 'n/a'
                print(f'    Table width: {w_val} ({w_type}) [{w_cm} cm]')
            el = tblPr.find(qn('w:bidiVisual'))
            if el is not None: print(f'    Table bidiVisual: {el.get(qn("w:val"), "1")}')
            el = tblPr.find(qn('w:jc'))
            if el is not None: print(f'    Table alignment: {el.get(qn("w:val"))}')
            # cell margins
            tblCellMar = tblPr.find(qn('w:tblCellMar'))
            if tblCellMar is not None:
                margins = {}
                for side in ['top','left','bottom','right']:
                    e2 = tblCellMar.find(qn(f'w:{side}'))
                    if e2 is not None: margins[side] = e2.get(qn('w:w'))
                if margins: print(f'    Cell margins (twips): {margins}')
            # table borders
            tblBorders = tblPr.find(qn('w:tblBorders'))
            if tblBorders is not None:
                for bname in ['top','left','bottom','right','insideH','insideV']:
                    be = tblBorders.find(qn(f'w:{bname}'))
                    if be is not None:
                        print(f'    Border {bname}: style={be.get(qn("w:val"))} sz={be.get(qn("w:sz"))} color={be.get(qn("w:color"))}')

        tblGrid = tbl.find(qn('w:tblGrid'))
        if tblGrid is not None:
            col_widths = [int(c.get(qn('w:w'), 0)) for c in tblGrid.findall(qn('w:gridCol'))]
            col_cm = [round(w * 2.54 / 1440, 2) for w in col_widths]
            print(f'    Column widths (twips): {col_widths}')
            print(f'    Column widths (cm):    {col_cm}')
            print(f'    Total width (twips):   {sum(col_widths)}')

        for ri, row in enumerate(table.rows):
            tr = row._tr
            trPr = tr.find(qn('w:trPr'))
            is_header = False; row_height = None; row_height_rule = None
            if trPr is not None:
                if trPr.find(qn('w:tblHeader')) is not None: is_header = True
                trH = trPr.find(qn('w:trHeight'))
                if trH is not None:
                    row_height = trH.get(qn('w:val'))
                    row_height_rule = trH.get(qn('w:hRule'))

            print(f'\n    Row {ri} (header={is_header}, height={row_height} hRule={row_height_rule}):')
            for ci, cell in enumerate(row.cells):
                if ci > 0 and cell is row.cells[ci-1]:
                    print(f'      Cell[{ri},{ci}] -> MERGED with previous')
                    continue

                tc = cell._tc
                tcPr = tc.find(qn('w:tcPr'))
                fill = None; fill_type = None; tcW = None; vAlign = None; text_dir = None
                if tcPr is not None:
                    shd = tcPr.find(qn('w:shd'))
                    if shd is not None:
                        fill = shd.get(qn('w:fill'))
                        fill_type = shd.get(qn('w:val'))
                    tcWel = tcPr.find(qn('w:tcW'))
                    if tcWel is not None:
                        tv = tcWel.get(qn('w:w'))
                        tt = tcWel.get(qn('w:type'))
                        tc_cm = round(int(tv) * 2.54 / 1440, 2) if tv and tt == 'dxa' else 'n/a'
                        tcW = f"{tv} ({tt}) [{tc_cm} cm]"
                    el = tcPr.find(qn('w:vAlign'))
                    if el is not None: vAlign = el.get(qn('w:val'))
                    el = tcPr.find(qn('w:textDirection'))
                    if el is not None: text_dir = el.get(qn('w:val'))

                print(f'      Cell[{ri},{ci}] fill={fill}(type={fill_type}) width={tcW} vAlign={vAlign} textDir={text_dir}')

                for para in cell.paragraphs:
                    pPr2 = para._p.find(qn('w:pPr'))
                    jc2 = None; bidi2 = None; sp2_b = None; sp2_a = None
                    if pPr2 is not None:
                        e = pPr2.find(qn('w:jc'))
                        if e is not None: jc2 = e.get(qn('w:val'))
                        e = pPr2.find(qn('w:bidi'))
                        if e is not None: bidi2 = e.get(qn('w:val'), '1')
                        e = pPr2.find(qn('w:spacing'))
                        if e is not None:
                            sp2_b = e.get(qn('w:before'))
                            sp2_a = e.get(qn('w:after'))

                    fonts2 = [get_font_name(r) for r in para.runs]
                    sizes2 = [half_pt_to_pt(r.font.size) for r in para.runs]
                    bolds2 = [r.bold for r in para.runs]
                    colors2 = [str(r.font.color.rgb) for r in para.runs if r.font.color and r.font.color.rgb]

                    if para.text.strip() or any(f for f in fonts2):
                        print(f'        Para align={jc2} bidi={bidi2} sp_before={sp2_b} after={sp2_a}')
                        print(f'        Text: "{para.text.strip()[:60]}"')
                        print(f'        Fonts={fonts2}, Sizes={sizes2}, Bolds={bolds2}, Colors={colors2}')

    # --- Footers/Headers ---
    print(f'\n--- Headers/Footers ---')
    for i, sec in enumerate(doc.sections):
        hdr = sec.header
        if hdr and not hdr.is_linked_to_previous:
            for para in hdr.paragraphs:
                if para.text.strip():
                    print(f'  Section {i} Header: "{para.text.strip()[:100]}"')
        ftr = sec.footer
        if ftr and not ftr.is_linked_to_previous:
            for para in ftr.paragraphs:
                if para.text.strip():
                    print(f'  Section {i} Footer: "{para.text.strip()[:100]}"')


if GENERATED:
    analyze_doc(SOURCE, 'SOURCE (working document)')
    analyze_doc(GENERATED, 'GENERATED document')
else:
    print("ERROR: Could not find generated file!")
