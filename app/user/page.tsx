'use client';
import React, { useEffect } from 'react';

const User = () => {
    // 获取所有用户信息
    const getUsers = async () => {
        // 从localStorage获取令牌
        const token = localStorage.getItem('token');
        
        // 如果有令牌，在请求头中添加Authorization
        const headers: HeadersInit = token ? {
            'Authorization': `Bearer ${token}`
        } : {};
        
        try {
            const res = await fetch('/api/users', {
                headers
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // 组件挂载时获取用户信息
    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <h1>User</h1>
        </div>
    );
};

export default User