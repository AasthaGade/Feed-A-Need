import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import type { DonationFormData } from '../../types';
import jsPDF from 'jspdf';

// ─── Icons (inline SVGs to avoid heroicons v1/v2 mismatch) ──────────────────

const GiftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" />
    </svg>
);


const LocationIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CreditCardIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const ShieldIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'form' | 'payment' | 'success';

interface PaymentData {
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    email: string;
}

// ─── Utility: generate PDF bill ─────────────────────────────────────────────

const generatePDFBill = (
    donation: DonationFormData,
    payment: PaymentData,
    invoiceNumber: string,
    donorName: string
) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── Brand bar ──
    doc.setFillColor(74, 25, 66);
    doc.rect(0, 0, W, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Feed-A-Need', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Connecting Generosity with Need', 14, 26);

    // Invoice label on right
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DONATION RECEIPT', W - 14, 18, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #${invoiceNumber}`, W - 14, 26, { align: 'right' });

    // ── Date row ──
    doc.setFillColor(212, 165, 116, 0.2);
    doc.setDrawColor(212, 165, 116);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 44, W - 28, 14, 3, 3, 'S');
    doc.setTextColor(74, 25, 66);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Date of Donation:', 18, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 55, 53);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status:', W / 2 + 4, 53);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(27, 94, 32);
    doc.text('PAID', W / 2 + 34, 53);

    // ── Donor details ──
    doc.setTextColor(74, 25, 66);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Donor Information', 14, 70);
    doc.setDrawColor(212, 165, 116);
    doc.setLineWidth(0.5);
    doc.line(14, 73, W - 14, 73);

    const donorRows = [
        ['Full Name:', donorName],
        ['Email Address:', payment.email],
        ['Payment Method:', 'Credit / Debit Card'],
        ['Card (masked):', `**** **** **** ${payment.cardNumber.replace(/\s/g, '').slice(-4)}`],
    ];
    let y = 81;
    doc.setFontSize(9);
    for (const [label, value] of donorRows) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 60, 90);
        doc.text(label, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(value, 65, y);
        y += 8;
    }

    // ── Donation details table ──
    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 25, 66);
    doc.text('Donation Details', 14, y);
    y += 3;
    doc.setLineWidth(0.5);
    doc.line(14, y, W - 14, y);
    y += 8;

    // Table header
    doc.setFillColor(74, 25, 66);
    doc.rect(14, y - 5, W - 28, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 18, y + 1);
    doc.text('Category', 95, y + 1);
    doc.text('Quantity / Units', 130, y + 1);
    doc.text('Amount', W - 18, y + 1, { align: 'right' });
    y += 12;

    // Table row
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(250, 248, 245);
    doc.rect(14, y - 5, W - 28, 12, 'F');
    doc.setDrawColor(212, 165, 116);
    doc.setLineWidth(0.3);
    doc.rect(14, y - 5, W - 28, 12, 'S');

    const descText = donation.description.length > 38 ? donation.description.slice(0, 38) + '…' : donation.description;
    doc.text(descText, 18, y + 2);
    doc.text(donation.type.charAt(0).toUpperCase() + donation.type.slice(1) + ' Donation', 95, y + 2);
    doc.text(donation.quantity || '1', 135, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 25, 66);
    doc.text(`₹${Number(donation.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, W - 18, y + 2, { align: 'right' });

    // ── Total block ──
    y += 20;
    doc.setFillColor(74, 25, 66);
    doc.roundedRect(W - 85, y, 71, 30, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', W - 82, y + 8);
    doc.text('Processing Fee', W - 82, y + 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL PAID', W - 82, y + 24);

    const amt = Number(donation.amount);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`₹${amt.toFixed(2)}`, W - 18, y + 8, { align: 'right' });
    doc.text('₹0.00', W - 18, y + 15, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`₹${amt.toFixed(2)}`, W - 18, y + 24, { align: 'right' });

    // ── Delivery details (Only for Food) ──
    if (donation.type === 'food') {
        y += 40;
        doc.setTextColor(74, 25, 66);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Delivery / Collection Info', 14, y);
        y += 3;
        doc.setDrawColor(212, 165, 116);
        doc.line(14, y, W - 14, y);
        y += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 50, 70);
        doc.text('Method:', 18, y);
        doc.setTextColor(50, 50, 50);
        doc.text(donation.method.charAt(0).toUpperCase() + donation.method.slice(1), 55, y);
        y += 7;
        doc.setTextColor(80, 50, 70);
        doc.text('Location:', 18, y);
        doc.setTextColor(50, 50, 50);
        const locText = donation.location.length > 80 ? donation.location.slice(0, 80) + '…' : donation.location;
        doc.text(locText, 55, y);
    }

    // ── Thank you section ──
    y += 18;
    doc.setFillColor(240, 235, 229);
    doc.roundedRect(14, y, W - 28, 22, 4, 4, 'F');
    doc.setTextColor(74, 25, 66);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank You for Your Generosity!', W / 2, y + 9, { align: 'center' });
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 60, 90);
    doc.text('Your donation makes a real difference in the lives of those in need.', W / 2, y + 17, { align: 'center' });

    // ── Footer ──
    doc.setFillColor(74, 25, 66);
    doc.rect(0, pageH - 14, W, 14, 'F');
    doc.setTextColor(212, 165, 116);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Feed-A-Need  •  support@feedaneed.org  •  www.feedaneed.org', W / 2, pageH - 6, { align: 'center' });

    doc.save(`FeedANeed_Invoice_${invoiceNumber}.pdf`);
};

// ─── Payment Page Component ──────────────────────────────────────────────────

interface PaymentPageProps {
    amount: number;
    onBack: () => void;
    onSuccess: (paymentData: PaymentData) => void;
}

const PaymentPage = ({ amount, onBack, onSuccess }: PaymentPageProps) => {
    const [paymentData, setPaymentData] = useState<PaymentData>({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        email: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<PaymentData>>({});

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const validate = () => {
        const e: Partial<PaymentData> = {};
        if (!paymentData.cardHolder.trim()) e.cardHolder = 'Name is required';
        if (paymentData.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
        if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) e.expiry = 'Use MM/YY format';
        if (paymentData.cvv.length < 3) e.cvv = 'CVV must be 3-4 digits';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) e.email = 'Enter a valid email';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setProcessing(true);
        // Simulate payment gateway delay
        await new Promise(r => setTimeout(r, 2200));
        setProcessing(false);
        onSuccess(paymentData);
    };

    const amt = Number(amount);

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <motion.button
                    type="button"
                    onClick={onBack}
                    className="p-2 rounded-xl border-2 border-[#d4a574] hover:bg-[#4a1942] hover:border-[#4a1942] hover:text-white transition-all"
                    style={{ color: '#4a1942' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </motion.button>
                <div>
                    <h1 className="text-3xl font-black" style={{ color: '#4a1942' }}>Secure Payment</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#888' }}>Your payment is protected with 256-bit SSL encryption</p>
                </div>
            </div>

            {/* Amount summary card */}
            <motion.div
                className="mb-6 rounded-2xl p-6 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg, #4a1942, #7a2a6e)', border: '2px solid #d4a574' }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                <div>
                    <p className="text-sm font-semibold text-white/70 uppercase tracking-wide">Total Amount</p>
                    <p className="text-4xl font-black text-white mt-1">
                        ₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-white/60 mt-1">Fund Donation · Feed-A-Need</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <CreditCardIcon className="w-12 h-12 text-white" />
                </div>
            </motion.div>

            {/* Payment form */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldIcon className="w-5 h-5" style={{ color: '#2d7d31' }} />
                    <span className="text-sm font-bold" style={{ color: '#2d7d31' }}>Secured by SSL / 256-bit Encryption</span>
                </div>

                {/* Accepted cards */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {['VISA', 'MC', 'AMEX', 'RuPay'].map(card => (
                        <span key={card} className="px-3 py-1.5 rounded-lg text-xs font-black border-2"
                            style={{ border: '2px solid #d4a574', color: '#4a1942', background: '#faf8f5' }}>
                            {card}
                        </span>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Cardholder name */}
                    <div>
                        <label className="block mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#4a1942' }}>
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            placeholder="Name as on card"
                            value={paymentData.cardHolder}
                            onChange={e => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
                            className="input-field"
                        />
                        {errors.cardHolder && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.cardHolder}</p>}
                    </div>

                    {/* Card number */}
                    <div>
                        <label className="block mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#4a1942' }}>
                            Card Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={paymentData.cardNumber}
                                onChange={e => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                                className="input-field pr-12"
                                maxLength={19}
                            />
                            <CreditCardIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                        </div>
                        {errors.cardNumber && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={paymentData.expiry}
                                onChange={e => setPaymentData({ ...paymentData, expiry: formatExpiry(e.target.value) })}
                                className="input-field"
                                maxLength={5}
                            />
                            {errors.expiry && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.expiry}</p>}
                        </div>
                        <div>
                            <label className="block mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                CVV
                            </label>
                            <input
                                type="password"
                                placeholder="•••"
                                value={paymentData.cvv}
                                onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                className="input-field"
                                maxLength={4}
                            />
                            {errors.cvv && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.cvv}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#4a1942' }}>
                            Email (Receipt will be sent here)
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={paymentData.email}
                            onChange={e => setPaymentData({ ...paymentData, email: e.target.value })}
                            className="input-field"
                        />
                        {errors.email && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.email}</p>}
                    </div>

                    {/* Pay button */}
                    <motion.button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 rounded-xl font-black text-white uppercase tracking-wide text-base flex items-center justify-center gap-3 transition-all"
                        style={{
                            background: processing ? '#9b6991' : 'linear-gradient(135deg, #4a1942, #7a2a6e)',
                            border: '2px solid transparent',
                            cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                        whileHover={processing ? {} : { scale: 1.02, boxShadow: '0 8px 30px rgba(74,25,66,0.4)' }}
                        whileTap={processing ? {} : { scale: 0.98 }}
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing Payment…
                            </>
                        ) : (
                            <>
                                <ShieldIcon className="w-5 h-5" />
                                Pay ₹{amt.toFixed(2)} Securely
                            </>
                        )}
                    </motion.button>

                    <p className="text-center text-xs" style={{ color: '#999' }}>
                        This is a demo payment page. No real transactions are made.
                    </p>
                </form>
            </div>
        </motion.div>
    );
};

// ─── Success Page Component ──────────────────────────────────────────────────

interface SuccessPageProps {
    donationData: DonationFormData;
    paymentData: PaymentData;
    invoiceNumber: string;
    donorName: string;
    onGoToDonations: () => void;
}

const SuccessPage = ({ donationData, paymentData, invoiceNumber, donorName, onGoToDonations }: SuccessPageProps) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        await new Promise(r => setTimeout(r, 300));
        generatePDFBill(donationData, paymentData, invoiceNumber, donorName);
        setDownloading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="max-w-xl mx-auto text-center"
        >
            {/* Success icon */}
            <motion.div
                className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2d7d31, #4caf50)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
                <CheckCircleIcon className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h1
                className="text-4xl font-black mb-3"
                style={{ color: '#4a1942' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Payment Successful
            </motion.h1>
            <motion.p
                className="text-lg mb-2"
                style={{ color: '#666' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Thank you for your generous donation of{' '}
                <strong style={{ color: '#4a1942' }}>
                    ₹{Number(donationData.amount).toFixed(2)}
                </strong>
            </motion.p>
            <motion.p
                className="text-sm mb-8"
                style={{ color: '#999' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Invoice #{invoiceNumber} &nbsp;·&nbsp; {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </motion.p>

            {/* Summary card */}
            <motion.div
                className="card text-left mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: '#4a1942' }}>
                    Transaction Summary
                </h3>
                {[
                    { label: 'Donor', value: donorName },
                    { label: 'Email', value: paymentData.email },
                    { label: 'Amount Paid', value: `₹${Number(donationData.amount).toFixed(2)}` },
                    { label: 'Donation Type', value: donationData.type.charAt(0).toUpperCase() + donationData.type.slice(1) },
                    ...(donationData.type !== 'fund' ? [{ label: 'Delivery Method', value: donationData.method.charAt(0).toUpperCase() + donationData.method.slice(1) }] : []),
                    { label: 'Status', value: 'Confirmed & Paid' },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #f0ebe5' }}>
                        <span className="text-sm font-semibold" style={{ color: '#888' }}>{label}</span>
                        <span className="text-sm font-bold" style={{ color: label === 'Status' ? '#2d7d31' : '#333' }}>{value}</span>
                    </div>
                ))}
            </motion.div>

            {/* Actions */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <motion.button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <DownloadIcon className="w-5 h-5" />
                    {downloading ? 'Generating PDF…' : 'Download Receipt (PDF)'}
                </motion.button>
                <motion.button
                    onClick={onGoToDonations}
                    className="flex-1 btn-secondary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    View All Donations
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

// ─── Main NewDonation Component ──────────────────────────────────────────────

const NewDonation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createDonation } = useDonations();

    const [step, setStep] = useState<Step>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const [invoiceNumber] = useState(() => `FAN-${Date.now().toString(36).toUpperCase()}`);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<DonationFormData>({
        type: 'food',
        description: '',
        quantity: '',
        method: 'pickup',
        location: '',
        amount: 0,
        fundTitle: '',
        fundCategory: '',
        recipientOrg: '',
        urgency: 'medium',
    });

    const handleGetLocation = () => {
        setGettingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        const addr = data.address;

                        const city = addr.city || addr.town || addr.village || addr.city_district || "";
                        const area = addr.suburb || addr.neighbourhood || addr.road || "";
                        const state = addr.state || "";

                        const readable = [area, city, state].filter(Boolean).join(', ');

                        setFormData((prev: DonationFormData) => ({
                            ...prev,
                            location: readable || data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        }));
                        if (formErrors.location) setFormErrors(prev => ({ ...prev, location: '' }));
                    } catch {
                        setFormData((prev: DonationFormData) => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                        if (formErrors.location) setFormErrors(prev => ({ ...prev, location: '' }));
                    } finally {
                        setGettingLocation(false);
                    }
                },
                () => {
                    alert('Unable to get your location. Please enter manually.');
                    setGettingLocation(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setGettingLocation(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const newErrors: Record<string, string> = {};

        if (formData.type === 'fund') {
            if (!formData.fundTitle?.trim()) newErrors.fundTitle = 'Please enter a campaign name.';
            if (!formData.fundCategory) newErrors.fundCategory = 'Category is required.';
            if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Valid amount is required.';
            if (!formData.description.trim()) newErrors.description = 'Please describe what the funds are for.';
        } else {
            if (!formData.description.trim()) newErrors.description = 'Please describe the donation.';
            if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required.';
        }

        if (!formData.location.trim()) newErrors.location = 'Location is required.';

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            setError('Please fix the errors below.');
            return;
        }

        setFormErrors({});
        if (formData.type === 'fund') {
            setStep('payment');
        } else {
            handleCreateDonation();
        }
    };

    const handleCreateDonation = async (pData?: PaymentData) => {
        setLoading(true);
        setError('');
        try {
            await createDonation({
                type: formData.type,
                description: formData.type === 'fund'
                    ? `[${formData.fundCategory || 'fund'}] ${formData.fundTitle} — ${formData.description}${formData.recipientOrg ? ` | For: ${formData.recipientOrg}` : ''}${formData.urgency ? ` | Urgency: ${formData.urgency}` : ''}`
                    : formData.description,
                quantity: formData.type === 'fund' ? '1 donation' : formData.quantity,
                method: formData.method as any,
                location: formData.location,
                amount: formData.amount ? Number(formData.amount) : undefined,
            });

            if (pData) {
                setPaymentData(pData);
                setStep('success');
            } else {
                navigate('/dashboard/donations');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create donation');
            setStep('form');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (pData: PaymentData) => {
        setPaymentData(pData);
        handleCreateDonation(pData);
    };

    const steps = [
        { label: 'Details', idx: 0 },
        ...(formData.type === 'fund' ? [{ label: 'Payment', idx: 1 }] : []),
        { label: 'Done', idx: formData.type === 'fund' ? 2 : 1 },
    ];
    const currentStepIdx = step === 'form' ? 0 : step === 'payment' ? 1 : steps.length - 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
        >
            {step !== 'success' && (
                <div className="mb-6">
                    <h1 className="text-4xl font-black mb-2" style={{ color: '#4a1942' }}>
                        {step === 'payment' ? 'Complete Payment' : 'Create New Donation'}
                    </h1>
                    <p className="text-base" style={{ color: '#666' }}>
                        {step === 'payment'
                            ? 'Enter your card details to complete your fund donation'
                            : 'Share your food or funds with those in need'}
                    </p>
                </div>
            )}

            {step !== 'success' && (
                <div className="mb-8 flex items-center gap-0">
                    {steps.map((s, i) => (
                        <div key={s.idx} className="flex items-center flex-1">
                            <div
                                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-black shrink-0 transition-all"
                                style={{
                                    background: i <= currentStepIdx ? '#4a1942' : '#e5e5e5',
                                    color: i <= currentStepIdx ? 'white' : '#999',
                                    border: i <= currentStepIdx ? '2px solid #4a1942' : '2px solid transparent'
                                }}
                            >
                                {i < currentStepIdx ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
                            </div>
                            <div className="ml-3 mr-3 font-bold text-xs uppercase tracking-widest hidden sm:block"
                                style={{ color: i <= currentStepIdx ? '#4a1942' : '#999' }}>
                                {s.label}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4" style={{ background: i < currentStepIdx ? '#4a1942' : '#f0ebe5' }} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="card p-8"
                    >
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold flex items-center gap-3 border-2 border-red-100">
                                    <span className="text-xl">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block mb-3 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                    Donation Type
                                </label>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {['food', 'fund', 'other'].map(t => (
                                        <motion.button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, type: t as any });
                                                if (formErrors.type) setFormErrors({ ...formErrors, type: '' });
                                            }}
                                            className="flex flex-col items-center justify-center p-4 rounded-xl transition-all"
                                            style={{
                                                background: formData.type === t ? '#4a194215' : 'white',
                                                border: `3px solid ${formData.type === t ? '#4a1942' : '#d4a574'}`,
                                                boxShadow: formData.type === t ? '0 8px 20px rgba(74,25,66,0.1)' : 'none'
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="text-2xl mb-1">{t === 'food' ? '🍱' : t === 'fund' ? '💵' : '📦'}</span>
                                            <span className="text-xs font-black uppercase tracking-widest"
                                                style={{ color: formData.type === t ? '#4a1942' : '#d4a574' }}>{t}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {formData.type === 'fund' ? (
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                                Campaign Title
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.fundTitle}
                                                onChange={e => {
                                                    setFormData({ ...formData, fundTitle: e.target.value });
                                                    if (formErrors.fundTitle) setFormErrors({ ...formErrors, fundTitle: '' });
                                                }}
                                                placeholder="e.g. Help for Flood Victims"
                                                className={`input-field ${formErrors.fundTitle ? 'border-red-500' : ''}`}
                                            />
                                            {formErrors.fundTitle && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.fundTitle}</p>}
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                                Category
                                            </label>
                                            <select
                                                value={formData.fundCategory}
                                                onChange={e => {
                                                    setFormData({ ...formData, fundCategory: e.target.value });
                                                    if (formErrors.fundCategory) setFormErrors({ ...formErrors, fundCategory: '' });
                                                }}
                                                className={`input-field ${formErrors.fundCategory ? 'border-red-500' : ''}`}
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Medical">Medical Relief</option>
                                                <option value="Education">Education Support</option>
                                                <option value="Disaster">Disaster Relief</option>
                                                <option value="Animal">Animal Welfare</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {formErrors.fundCategory && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.fundCategory}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                            Donation Amount (₹)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: '#4a1942' }}>₹</span>
                                            <input
                                                type="number"
                                                value={formData.amount}
                                                onChange={e => {
                                                    setFormData({ ...formData, amount: Number(e.target.value) });
                                                    if (formErrors.amount) setFormErrors({ ...formErrors, amount: '' });
                                                }}
                                                placeholder="0.00"
                                                className={`input-field pl-8 ${formErrors.amount ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {formErrors.amount && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.amount}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                            What is this for?
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => {
                                                setFormData({ ...formData, description: e.target.value });
                                                if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                                            }}
                                            placeholder="Briefly explain how this donation will help..."
                                            className={`input-field min-h-[100px] ${formErrors.description ? 'border-red-500' : ''}`}
                                        />
                                        {formErrors.description && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.description}</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                            Detailed Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => {
                                                setFormData({ ...formData, description: e.target.value });
                                                if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                                            }}
                                            placeholder="What are you donating? e.g. 50 boxes of fresh apples"
                                            className={`input-field min-h-[100px] py-4 ${formErrors.description ? 'border-red-500' : ''}`}
                                        />
                                        {formErrors.description && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.description}</p>}
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                                Quantity / Weight
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.quantity}
                                                onChange={e => {
                                                    setFormData({ ...formData, quantity: e.target.value });
                                                    if (formErrors.quantity) setFormErrors({ ...formErrors, quantity: '' });
                                                }}
                                                placeholder="e.g. 50 kg / 20 units"
                                                className={`input-field ${formErrors.quantity ? 'border-red-500' : ''}`}
                                            />
                                            {formErrors.quantity && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.quantity}</p>}
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                                Delivery Method
                                            </label>
                                            <select
                                                value={formData.method}
                                                onChange={e => setFormData({ ...formData, method: e.target.value as any })}
                                                className="input-field"
                                            >
                                                <option value="pickup">Pickup (We collect from you)</option>
                                                <option value="dropoff">Drop-off (You deliver to us)</option>
                                                <option value="delivery">Delivery (We arrange courier)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block mb-2 font-black text-xs uppercase tracking-widest" style={{ color: '#4a1942' }}>
                                    Location
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => {
                                            setFormData({ ...formData, location: e.target.value });
                                            if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                                        }}
                                        placeholder="Enter your location or use GPS"
                                        className={`input-field flex-1 ${formErrors.location ? 'border-red-500' : ''}`}
                                    />
                                    <motion.button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={gettingLocation}
                                        className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <LocationIcon className="w-4 h-4" />
                                        {gettingLocation ? 'Detecting…' : 'Use GPS'}
                                    </motion.button>
                                </div>
                                {formErrors.location && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{formErrors.location}</p>}
                                <p className="text-xs mt-1.5" style={{ color: '#999' }}>
                                    Click "Use GPS" to auto-detect your current location
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating…
                                        </>
                                    ) : formData.type === 'fund' ? (
                                        <>
                                            <CreditCardIcon className="w-5 h-5" />
                                            Proceed to Payment
                                        </>
                                    ) : (
                                        <>
                                            <GiftIcon className="w-5 h-5" />
                                            Create Donation
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/dashboard/donations')}
                                    className="btn-secondary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 'payment' && (
                    <PaymentPage
                        key="payment"
                        amount={formData.amount || 0}
                        onBack={() => setStep('form')}
                        onSuccess={handlePaymentSuccess}
                    />
                )}

                {step === 'success' && paymentData && (
                    <SuccessPage
                        key="success"
                        donationData={formData}
                        paymentData={paymentData}
                        invoiceNumber={invoiceNumber}
                        donorName={user?.name || 'Donor'}
                        onGoToDonations={() => navigate('/dashboard/donations')}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NewDonation;
