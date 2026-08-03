// อัตราส่วนแปลงหน่วยโดยอ้างอิงจากหน่วย 'เมตร (Meter)' เป็นหลัก
const unitRatesToMeter = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
};

// ดึง Element จาก HTML
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const formulaText = document.getElementById('formulaText');
const copyBtn = document.getElementById('copyBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

let history = [];

// ฟังก์ชันหลักในการคำนวณแปลงหน่วย
function convertUnits() {
    const val = parseFloat(fromValueInput.value);
    
    if (isNaN(val)) {
        toValueInput.value = '';
        formulaText.innerText = 'กรุณากรอกตัวเลขที่ถูกต้อง';
        return;
    }

    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // คำนวณผ่านหน่วยเมตรกลาง (Base Unit: Meter)
    const valueInMeters = val * unitRatesToMeter[fromUnit];
    const convertedValue = valueInMeters / unitRatesToMeter[toUnit];

    // จัดการการแสดงผลจุดทศนิยม
    const formattedResult = Number.isInteger(convertedValue) 
        ? convertedValue.toString() 
        : convertedValue.toFixed(6).replace(/\.?0+$/, "");

    toValueInput.value = formattedResult;

    // อัปเดตสูตรอ้างอิง
    const baseRate = unitRatesToMeter[fromUnit] / unitRatesToMeter[toUnit];
    const formattedRate = Number.isInteger(baseRate) ? baseRate : baseRate.toFixed(6).replace(/\.?0+$/, "");
    formulaText.innerText = `1 ${fromUnit} = ${formattedRate} ${toUnit}`;
}

// ฟังก์ชันบันทึกประวัติ
function addHistory() {
    const val = fromValueInput.value;
    const res = toValueInput.value;
    if (!val || !res) return;

    const record = `${val} ${fromUnitSelect.value} = ${res} ${toUnitSelect.value}`;
    
    // ไม่บันทึกซ้ำรายการล่าสุด
    if (history[0] === record) return;

    history.unshift(record);
    if (history.length > 5) history.pop(); // เก็บสูงสุด 5 รายการล่าสุด

    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = `<li class="empty-history">ยังไม่มีประวัติการแปลงหน่วย</li>`;
        return;
    }

    historyList.innerHTML = history
        .map(item => `<li><span>${item}</span><i class="fa-solid fa-check" style="color:#38bdf8"></i></li>`)
        .join('');
}

// ปุ่มสลับหน่วย (Swap)
swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    // เอฟเฟกต์หมุนปุ่ม
    swapBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => swapBtn.style.transform = '', 300);

    convertUnits();
    addHistory();
});

// คัดลอกผลลัพธ์
copyBtn.addEventListener('click', () => {
    if (!toValueInput.value) return;
    navigator.clipboard.writeText(toValueInput.value);
    
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> คัดลอกแล้ว!`;
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
    }, 1500);
});

// ล้างประวัติ
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    renderHistory();
});

// Event Listeners สำหรับคำนวณแบบ Real-time
fromValueInput.addEventListener('input', convertUnits);
fromUnitSelect.addEventListener('change', convertUnits);
toUnitSelect.addEventListener('change', convertUnits);

// บันทึกประวัติเมื่อผู้ใช้พิมพ์เสร็จ (Debounce)
let timeout = null;
fromValueInput.addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout(addHistory, 1200);
});

// ประมวลผลครั้งแรกเมื่อโหลดหน้าเว็บ
convertUnits();