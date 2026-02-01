import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiUser, FiPhone, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { reservationAPI } from '../utils/api';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utils/helpers';
import '../styles/dashboard.css'; // Reusing dashboard styles for consistency

const TableReservation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('book'); // book, view
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Booking Form State
    const [booking, setBooking] = useState({
        name: user?.name || '',
        contact: user?.phone || '',
        peopleCount: 2,
        date: new Date().toISOString().split('T')[0],
        timeSlot: '12:00'
    });

    // Reservations List State
    const [reservations, setReservations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch reservations
    const fetchReservations = async () => {
        try {
            setLoading(true);
            const result = await reservationAPI.getAllReservations();
            if (result.success) {
                setReservations(result.data);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'view') {
            fetchReservations();
        }
    }, [activeTab]);

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await reservationAPI.createReservation(booking);
            if (result.success) {
                setMessage({ type: 'success', text: `Table reserved! ID: ${result.data.reservationId}. Table #${result.data.tableNumber}` });
                // Switch to view tab after success
                setTimeout(() => setActiveTab('view'), 2000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            const result = await reservationAPI.cancelReservation(id);
            if (result.success) {
                fetchReservations(); // Refresh list
                alert('Reservation cancelled.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredReservations = reservations.filter(r =>
        r.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header className="dash-header">
                <h1>Table Reservation</h1>
                <p>Book your spot at the food court conveniently.</p>
            </header>

            <div className="dashboard-wrapper" style={{ display: 'block' }}>
                {/* Navigation Menu */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                    <button
                        onClick={() => setActiveTab('book')}
                        className={`btn ${activeTab === 'book' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
                    >
                        Create Reservation
                    </button>
                    <button
                        onClick={() => setActiveTab('view')}
                        className={`btn ${activeTab === 'view' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
                    >
                        View Reservations
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline"
                        style={{ marginLeft: 'auto', border: 'none', color: '#64748b' }}
                    >
                        Exit System
                    </button>
                </div>

                {/* Content Area */}
                <div className="dash-card">
                    {message.text && (
                        <div style={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                            color: message.type === 'success' ? '#065f46' : '#b91c1c'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'book' && (
                        <div className="dash-card-body">
                            <form onSubmit={handleBookSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div className="dash-form-group">
                                    <label className="dash-label"><FiUser /> Name</label>
                                    <input
                                        type="text"
                                        className="dash-input"
                                        value={booking.name}
                                        onChange={e => setBooking({ ...booking, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="dash-form-group">
                                    <label className="dash-label"><FiPhone /> Contact Number</label>
                                    <input
                                        type="text"
                                        className="dash-input"
                                        value={booking.contact}
                                        onChange={e => setBooking({ ...booking, contact: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-2">
                                    <div className="dash-form-group">
                                        <label className="dash-label"><FiUsers /> Number of People</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="dash-input"
                                            value={booking.peopleCount}
                                            onChange={e => setBooking({ ...booking, peopleCount: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="dash-form-group">
                                        <label className="dash-label"><FiCalendar /> Date</label>
                                        <input
                                            type="date"
                                            className="dash-input"
                                            value={booking.date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => setBooking({ ...booking, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="dash-form-group">
                                    <label className="dash-label"><FiClock /> Time Slot</label>
                                    <select
                                        className="dash-input"
                                        value={booking.timeSlot}
                                        onChange={e => setBooking({ ...booking, timeSlot: e.target.value })}
                                        required
                                    >
                                        {['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-full"
                                    disabled={loading}
                                    style={{ marginTop: '1rem' }}
                                >
                                    {loading ? 'Checking Availability...' : 'Confirm Reservation'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'view' && (
                        <div className="dash-card-body">
                            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Search by ID or Name..."
                                    className="dash-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {loading ? (
                                <div className="spinner" style={{ margin: '2rem auto' }}></div>
                            ) : filteredReservations.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#64748b' }}>No reservations found.</p>
                            ) : (
                                <div className="dash-table-container">
                                    <table className="dash-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Date & Time</th>
                                                <th>People</th>
                                                <th>Table</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredReservations.map(res => (
                                                <tr key={res._id}>
                                                    <td style={{ fontWeight: 'bold' }}>{res.reservationId}</td>
                                                    <td>{res.name}<div style={{ fontSize: '0.8em', color: '#64748b' }}>{res.contact}</div></td>
                                                    <td>{res.date} <br /> {res.timeSlot}</td>
                                                    <td>{res.peopleCount}</td>
                                                    <td>#{res.tableNumber}</td>
                                                    <td>
                                                        <span className={`dash-badge ${res.status === 'Active' ? 'badge-ready' : 'badge-cancelled'}`}>
                                                            {res.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {res.status === 'Active' && (
                                                            <button
                                                                onClick={() => handleCancel(res.reservationId)}
                                                                className="btn btn-outline"
                                                                style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableReservation;
