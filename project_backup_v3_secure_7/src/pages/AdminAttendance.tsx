import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AttendanceEntry {
    test_name: string;
    user_email: string;
    score: number;
    submitted_at: string;
}

export default function AdminAttendance() {
    const [data, setData] = useState<AttendanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState('all');
    const [availableTests, setAvailableTests] = useState<string[]>([]);

    useEffect(() => {
        fetchTests();
        fetchAttendance();
    }, [selectedTest]);

    const fetchTests = async () => {
        const { data, error } = await supabase.from('test_results').select('test_name').order('test_name');
        if (!error) {
            const unique = [...new Set(data.map((d: any) => d.test_name))];
            setAvailableTests(unique);
        }
    };

    const fetchAttendance = async () => {
        setLoading(true);
        let query = supabase.from('test_results').select('*').order('submitted_at', { ascending: false });
        if (selectedTest !== 'all') query = query.eq('test_name', selectedTest);
        const { data, error } = await query;
        if (!error) setData(data);
        setLoading(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Test Attendance (Admin)</h1>
            <select
                value={selectedTest}
                onChange={e => setSelectedTest(e.target.value)}
                className="mb-4 p-2 border rounded"
            >
                <option value="all">All Tests</option>
                {availableTests.map(t => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
            {loading ? (
                <Loader className="animate-spin" />
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Test</th>
                            <th className="p-2">Student</th>
                            <th className="p-2">Score</th>
                            <th className="p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{row.test_name}</td>
                                <td className="p-2">{row.user_email}</td>
                                <td className="p-2 font-medium">{row.score}</td>
                                <td className="p-2">{new Date(row.submitted_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
