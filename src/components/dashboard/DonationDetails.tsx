import { useParams, useNavigate } from 'react-router-dom';
import { useDonations } from '../../hooks/useDonations';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useState } from 'react';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const GiftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" />
    </svg>
);
const CashIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const LocationIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const TruckIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
);
const DownloadIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ─── Status style map ─────────────────────────────────────────────────────────
const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
    pending: { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' },
    approved: { bg: '#e8f5e9', color: '#1b5e20', border: '#66bb6a' },
    completed: { bg: '#f5f5f5', color: '#424242', border: '#9e9e9e' },
    cancelled: { bg: '#ffebee', color: '#b71c1c', border: '#ef9a9a' },
};

// ─── PDF generator for an existing donation record ────────────────────────────
const downloadDonationPDF = (donation: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const invoiceNo = donation.invoiceNumber || `FAN-${donation.id.toUpperCase()}`;

    // Header bar
    doc.setFillColor(74, 25, 66);
    doc.rect(0, 0, W, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('Feed-A-Need', 14, 18);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Connecting Generosity with Need', 14, 26);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('DONATION RECEIPT', W - 14, 18, { align: 'right' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #${invoiceNo}`, W - 14, 26, { align: 'right' });

    // Date row
    doc.setDrawColor(212, 165, 116); doc.setLineWidth(0.3);
    doc.roundedRect(14, 44, W - 28, 14, 3, 3, 'S');
    doc.setTextColor(74, 25, 66); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('Date:', 18, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(donation.date).toLocaleDateString('en-US', { dateStyle: 'long' }), 32, 53);
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', W / 2 + 4, 53);
    doc.setTextColor(50, 120, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(donation.status.toUpperCase(), W / 2 + 22, 53);

    // Donor block
    doc.setTextColor(74, 25, 66); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Donor Information', 14, 70);
    doc.setLineWidth(0.5); doc.line(14, 73, W - 14, 73);
    let y = 81;
    const donorRows = [
        ['Name:', donation.donor],
        ['Email:', donation.donorEmail],
        ['Phone:', donation.donorPhone],
        ['Address:', donation.donorAddress],
    ];
    doc.setFontSize(9);
    for (const [label, val] of donorRows) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 60, 90);
        doc.text(label, 18, y);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
        doc.text(String(val || '—'), 55, y);
        y += 8;
    }

    // Donation table
    y += 4;
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(74, 25, 66);
    doc.text('Donation Details', 14, y); y += 3;
    doc.setLineWidth(0.5); doc.line(14, y, W - 14, y); y += 8;

    // Table header
    doc.setFillColor(74, 25, 66); doc.rect(14, y - 5, W - 28, 10, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('Description', 18, y + 1);
    doc.text('Type', 95, y + 1);
    doc.text('Qty / Units', 125, y + 1);
    doc.text('Amount', W - 18, y + 1, { align: 'right' });
    y += 12;

    // Table row
    doc.setTextColor(50, 50, 50); doc.setFont('helvetica', 'normal');
    doc.setFillColor(250, 248, 245);
    doc.rect(14, y - 5, W - 28, 12, 'F');
    doc.setDrawColor(212, 165, 116); doc.setLineWidth(0.3);
    doc.rect(14, y - 5, W - 28, 12, 'S');
    const desc = donation.description.length > 38 ? donation.description.slice(0, 38) + '…' : donation.description;
    doc.text(desc, 18, y + 2);
    doc.text(donation.type.charAt(0).toUpperCase() + donation.type.slice(1), 95, y + 2);
    doc.text(donation.quantity || '1', 125, y + 2);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(74, 25, 66);
    const amt = donation.amount ? `₹${Number(donation.amount).toFixed(2)}` : 'In-Kind';
    doc.text(amt, W - 18, y + 2, { align: 'right' });

    // Total block
    y += 20;
    if (donation.amount) {
        doc.setFillColor(74, 25, 66);
        doc.roundedRect(W - 85, y, 71, 22, 3, 3, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
        doc.text('Total Paid', W - 82, y + 8);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
        doc.text(`₹${Number(donation.amount).toFixed(2)}`, W - 18, y + 16, { align: 'right' });
        y += 32;
    } else {
        y += 10;
    }

    // Delivery info (only for food)
    if (donation.type === 'food') {
        doc.setTextColor(74, 25, 66); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text('Delivery / Collection Info', 14, y); y += 3;
        doc.setDrawColor(212, 165, 116); doc.line(14, y, W - 14, y); y += 8;
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 50, 70);
        doc.text('Method:', 18, y); doc.setTextColor(50, 50, 50);
        doc.text(donation.method.charAt(0).toUpperCase() + donation.method.slice(1), 48, y); y += 7;
        doc.setTextColor(80, 50, 70);
        doc.text('Location:', 18, y); doc.setTextColor(50, 50, 50);
        const loc = donation.location.length > 80 ? donation.location.slice(0, 80) + '…' : donation.location;
        doc.text(loc, 48, y);
    }

    // Thank you
    y += 18;
    doc.setFillColor(240, 235, 229);
    doc.roundedRect(14, y, W - 28, 22, 4, 4, 'F');
    doc.setTextColor(74, 25, 66); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Thank You for Your Generosity! 💙', W / 2, y + 9, { align: 'center' });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 60, 90);
    doc.text('Your donation makes a real difference in the lives of those in need.', W / 2, y + 17, { align: 'center' });

    // Footer
    doc.setFillColor(74, 25, 66); doc.rect(0, pageH - 14, W, 14, 'F');
    doc.setTextColor(212, 165, 116); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.text('Feed-A-Need  •  support@feedaneed.org  •  www.feedaneed.org', W / 2, pageH - 6, { align: 'center' });

    doc.save(`FeedANeed_Receipt_${invoiceNo}.pdf`);
};

// ─── Component ────────────────────────────────────────────────────────────────
const DonationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { donations, loading } = useDonations();
    const [downloading, setDownloading] = useState(false);

    const donation = donations.find(d => d.id === id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-black mb-4" style={{ color: '#4a1942' }}>Donation not found</h2>
                <motion.button
                    onClick={() => navigate('/dashboard/donations')}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ← Back to Donations
                </motion.button>
            </div>
        );
    }

    const sc = statusStyle[donation.status] ?? statusStyle.pending;
    const isFund = donation.type === 'fund';

    const handleDownload = async () => {
        setDownloading(true);
        await new Promise(r => setTimeout(r, 200));
        downloadDonationPDF(donation);
        setDownloading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Back button */}
            <motion.button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 font-bold text-sm transition-colors"
                style={{ color: '#4a1942' }}
                whileHover={{ x: -4 }}
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Donations
            </motion.button>

            {/* Main card */}
            <div className="card">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6"
                    style={{ borderBottom: '2px dashed #d4a574' }}>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl" style={{ background: isFund ? '#e8f5e9' : '#fff3e0' }}>
                                {isFund
                                    ? <CashIcon className="w-7 h-7" />
                                    : <GiftIcon className="w-7 h-7" />}
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                style={{ background: isFund ? '#e8f5e9' : '#fff3e0', color: isFund ? '#1b5e20' : '#e65100', border: `2px solid ${isFund ? '#66bb6a' : '#ffb74d'}` }}>
                                {isFund ? '💵 Fund Donation' : '🍱 Food Donation'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black mb-2" style={{ color: '#4a1942' }}>
                            {donation.description}
                        </h1>
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                            <span className="flex items-center gap-1 font-semibold" style={{ color: '#888' }}>
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(donation.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                                style={{ background: sc.bg, color: sc.color, border: `2px solid ${sc.border}` }}>
                                {donation.status}
                            </span>
                            {donation.paymentStatus === 'paid' && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                                    style={{ background: '#e8f5e9', color: '#1b5e20', border: '2px solid #66bb6a' }}>
                                    ✓ Payment Confirmed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Download PDF button (fund donations with amount) */}
                    {isFund && donation.amount && (
                        <motion.button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="btn-primary inline-flex items-center gap-2 shrink-0"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <DownloadIcon className="w-5 h-5" />
                            {downloading ? 'Generating…' : 'Download Receipt'}
                        </motion.button>
                    )}
                </div>

                {/* Details grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left – Donation Details */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#888' }}>
                            Donation Details
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Type', value: isFund ? '💵 Fund' : '🍱 Food' },
                                { label: 'Quantity', value: donation.quantity },
                                ...(isFund ? [] : [{ label: 'Method', value: donation.method.charAt(0).toUpperCase() + donation.method.slice(1) }]),
                                ...(donation.amount ? [{ label: 'Amount', value: `₹${Number(donation.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` }] : []),
                                ...(donation.approvedDate ? [{ label: 'Approved On', value: new Date(donation.approvedDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) }] : []),
                                ...(donation.completedDate ? [{ label: 'Completed On', value: new Date(donation.completedDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) }] : []),
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between py-2.5 text-sm"
                                    style={{ borderBottom: '1px solid #faf8f5' }}>
                                    <span className="font-semibold" style={{ color: '#888' }}>{label}</span>
                                    <span className="font-black" style={{ color: '#333' }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right – Donor Info */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#888' }}>
                            Donor Information
                        </h3>
                        <div className="p-6 rounded-xl space-y-4" style={{ background: '#faf8f5', border: '2px solid #d4a574' }}>
                            <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#aaa' }}>Full Name</p>
                                <p className="font-black text-lg" style={{ color: '#4a1942' }}>{donation.donor}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#aaa' }}>Email</p>
                                <p className="font-medium text-sm" style={{ color: '#333' }}>{donation.donorEmail}</p>
                            </div>
                            {donation.donorPhone && (
                                <div>
                                    <p className="text-xs font-semibold mb-1" style={{ color: '#aaa' }}>Phone</p>
                                    <p className="font-medium text-sm" style={{ color: '#333' }}>{donation.donorPhone}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#aaa' }}>
                                    <LocationIcon className="w-3.5 h-3.5" />
                                    Pickup / Drop Location
                                </p>
                                <p className="font-medium text-sm leading-relaxed" style={{ color: '#333' }}>
                                    {donation.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery info card (only for food) */}
            {!isFund && (
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-xl shrink-0" style={{ background: '#e3f2fd' }}>
                        <TruckIcon className="w-8 h-8" style={{ color: '#0d47a1' }} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#888' }}>
                            Delivery Method
                        </p>
                        <p className="text-xl font-black capitalize" style={{ color: '#4a1942' }}>
                            {donation.method}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DonationDetails;
