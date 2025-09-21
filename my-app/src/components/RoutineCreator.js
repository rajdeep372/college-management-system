'use client';
import { useState } from 'react';

const RoutineCreator = () => {
    const formStyle = {
        display: 'flex',
        gap: '15px',
        alignItems: 'flex-end',
        backgroundColor: '#161625',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #4a4a5a',
        flexWrap: 'wrap',
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: '150px'
    };

    const labelStyle = {
        marginBottom: '5px',
        color: '#a0a0a0',
    };

    const inputStyle = {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #4a4a5a',
        backgroundColor: '#1a1a2e',
        color: '#e0e0e0',
        fontSize: '1rem',
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#00c6ff',
        color: '#161625',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        height: '45px', // Align with inputs
    };

    return (
        <form style={formStyle}>
             <div style={inputGroupStyle}>
                <label style={labelStyle}>Day</label>
                <input type="text" style={inputStyle} placeholder="e.g., Monday" />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Time</label>
                <input type="text" style={inputStyle} placeholder="e.g., 09:00 - 10:00" />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Subject</label>
                <input type="text" style={inputStyle} placeholder="e.g., Physics" />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Teacher</label>
                <input type="text" style={inputStyle} placeholder="e.g., Mr. Armstrong" />
            </div>
            <button type="submit" style={buttonStyle}>Add to Routine</button>
        </form>
    );
};

export default RoutineCreator;