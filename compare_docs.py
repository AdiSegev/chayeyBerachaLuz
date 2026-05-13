
from docx import Document
from docx.shared import Pt, Inches, Emu, RGBColor
from docx.oxml.ns import qn
import lxml.etree as etree

SOURCE = r'C:\Users\adi.CLOUD\Desktop\פרטי\זמני תפילות קיץ תשפו - מנין תימני.docx'
GENERATED = r'C:\Users\adi.CLOUD\Downloads\zmanim_shabbat_summer_תשפ"ו.docx'

def emu_to_cm(emu):
    if emu is None: return None
    return round(emu / 360000, 2)

def emu_to_inches(emu):
    if emu is None: return None
    return round(emu / 914400, 3)

def half_pt_to_pt(half_pt):
    if half_pt is None: return None
    return half_pt / 2

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
        jc = None
        bidi = None
        spacing_before = None
        spacing_after = None
        indent_left = None
        indent_right = None
        if pPr is not None:
            jc_el = pPr.find(qn('w:jc'))
            if jc_el is not None: jc = jc_el.get(qn('w:val'))
            bidi_el = pPr.find(qn('w:bidi'))
            if bidi_el is not None: bidi = bidi_el.get(qn('w:val'), '1')
            sp_el = pPr.find(qn('w:spacing'))
            if sp_el is not None:
                spacing_before = sp_el.get(qn('w:before'))
                spacing_after = sp_el.get(qn('w:after'))
            ind_el = pPr.find(qn('w:ind'))
            if ind_el is not None:
                indent_left = ind_el.get(qn('w:left'))
                indent_right = ind_el.get(qn('w:right'))

        fonts = set()
        sizes = set()
        bolds = set()
        colors = set()
        for run in para.runs:
            rPr = run._r.find(qn('w:rPr'))
            fname = run.font.name
            # Also check rFonts
            if rPr is not None:
                rFonts = rPr.find(qn('w:rFonts'))
                if rFonts is not None:
                    fname = rFonts.get(qn('w:ascii')) or rFonts.get(qn('w:hAnsi')) or rFonts.get(qn('w:cs')) or fname
            if fname: fonts.add(fname)
            if run.font.size: sizes.add(half_pt_to_pt(run.font.size))
            bolds.add(run.bold)
            if run.font.color and run.font.color.rgb:
                colors.add(str(run.font.color.rgb))

        print(f'  [{i}] "{para.text[:60]}"')
        print(f'       Style={para.style.name}, Align={jc}, RTL/bidi={bidi}')
        print(f'       Fonts={fonts}, Sizes={sizes}, Bolds={bolds}, Colors={colors}')
        if spacing_before or spacing_after:
            print(f'       Spacing before={spacing_before} twips, after={spacing_after} twips')
        if indent_left or indent_right:
            print(f'       Indent left={indent_left} right={indent_right} twips')

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
                print(f'    Table width: {w_val} ({w_type}) = {w_cm} cm')
            bidi_el = tblPr.find(qn('w:bidiVisual'))
            if bidi_el is not None:
                print(f'    Table bidiVisual: {bidi_el.get(qn("w:val"), "1")}')
            jc_el = tblPr.find(qn('w:jc'))
            if jc_el is not None:
                print(f'    Table alignment: {jc_el.get(qn("w:val"))}')
            # Table borders
            tblBorders = tblPr.find(qn('w:tblBorders'))
            if tblBorders is not None:
                for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
                    el = tblBorders.find(qn(f'w:{border_name}'))
                    if el is not None:
                        print(f'    Border {border_name}: style={el.get(qn("w:val"))} size={el.get(qn("w:sz"))} color={el.get(qn("w:color"))}')
            # Table cell margins
            tblCellMar = tblPr.find(qn('w:tblCellMar'))
            if tblCellMar is not None:
                for side in ['top', 'left', 'bottom', 'right']:
                    el = tblCellMar.find(qn(f'w:{side}'))
                    if el is not None:
                        print(f'    Cell margin {side}: {el.get(qn("w:w"))} twips')

        # Column widths
        tblGrid = tbl.find(qn('w:tblGrid'))
        if tblGrid is not None:
            col_widths = [int(c.get(qn('w:w'), 0)) for c in tblGrid.findall(qn('w:gridCol'))]
            col_widths_cm = [round(w * 2.54 / 1440, 2) for w in col_widths]
            print(f'    Column widths (twips): {col_widths}')
            print(f'    Column widths (cm):    {col_widths_cm}')
            print(f'    Total width (twips):   {sum(col_widths)}')

        # Row details - show all rows
        for ri, row in enumerate(table.rows):
            tr = row._tr
            trPr = tr.find(qn('w:trPr'))
            is_header = False
            row_height = None
            row_height_rule = None
            if trPr is not None:
                hdr_el = trPr.find(qn('w:tblHeader'))
                if hdr_el is not None: is_header = True
                trH = trPr.find(qn('w:trHeight'))
                if trH is not None:
                    row_height = trH.get(qn('w:val'))
                    row_height_rule = trH.get(qn('w:hRule'))

            print(f'\n    Row {ri} (header={is_header}, height={row_height} hRule={row_height_rule}):')
            for ci, cell in enumerate(row.cells):
                # skip merged cells (same object as previous)
                if ci > 0 and cell is row.cells[ci-1]:
                    print(f'      Cell[{ri},{ci}] -> MERGED with previous')
                    continue

                tc = cell._tc
                tcPr = tc.find(qn('w:tcPr'))
                fill = None
                fill_type = None
                tcW = None
                vAlign = None
                text_dir = None
                if tcPr is not None:
                    shd = tcPr.find(qn('w:shd'))
                    if shd is not None:
                        fill = shd.get(qn('w:fill'))
                        fill_type = shd.get(qn('w:val'))
                    tcWel = tcPr.find(qn('w:tcW'))
                    if tcWel is not None:
                        tcW_val = tcWel.get(qn('w:w'))
                        tcW_type = tcWel.get(qn('w:type'))
                        tcW_cm = round(int(tcW_val) * 2.54 / 1440, 2) if tcW_val and tcW_type == 'dxa' else 'n/a'
                        tcW = f"{tcW_val} ({tcW_type}) = {tcW_cm} cm"
                    vAel = tcPr.find(qn('w:vAlign'))
                    if vAel is not None: vAlign = vAel.get(qn('w:val'))
                    td_el = tcPr.find(qn('w:textDirection'))
                    if td_el is not None: text_dir = td_el.get(qn('w:val'))

                print(f'      Cell[{ri},{ci}] fill={fill} (type={fill_type}) width={tcW}')
                print(f'               vAlign={vAlign} textDir={text_dir}')

                for para in cell.paragraphs:
                    pPr2 = para._p.find(qn('w:pPr'))
                    jc2 = None
                    bidi2 = None
                    sp_before2 = None
                    sp_after2 = None
                    if pPr2 is not None:
                        jc2_el = pPr2.find(qn('w:jc'))
                        if jc2_el is not None: jc2 = jc2_el.get(qn('w:val'))
                        bidi2_el = pPr2.find(qn('w:bidi'))
                        if bidi2_el is not None: bidi2 = bidi2_el.get(qn('w:val'), '1')
                        sp_el2 = pPr2.find(qn('w:spacing'))
                        if sp_el2 is not None:
                            sp_before2 = sp_el2.get(qn('w:before'))
                            sp_after2 = sp_el2.get(qn('w:after'))

                    fonts2 = []
                    sizes2 = []
                    bolds2 = []
                    colors2 = []
                    for run in para.runs:
                        rPr2 = run._r.find(qn('w:rPr'))
                        fname2 = run.font.name
                        if rPr2 is not None:
                            rFonts2 = rPr2.find(qn('w:rFonts'))
                            if rFonts2 is not None:
                                fname2 = rFonts2.get(qn('w:ascii')) or rFonts2.get(qn('w:hAnsi')) or rFonts2.get(qn('w:cs')) or fname2
                        fonts2.append(fname2)
                        sizes2.append(half_pt_to_pt(run.font.size))
                        bolds2.append(run.bold)
                        if run.font.color and run.font.color.rgb:
                            colors2.append(str(run.font.color.rgb))

                    if para.text.strip() or fonts2:
                        print(f'        Para align={jc2} bidi={bidi2} spacing_before={sp_before2} after={sp_after2}')
                        print(f'        Text: "{para.text.strip()[:50]}"')
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


analyze_doc(SOURCE, 'SOURCE (working document)')
analyze_doc(GENERATED, 'GENERATED document')
