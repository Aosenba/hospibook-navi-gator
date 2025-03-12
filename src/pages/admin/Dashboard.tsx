
import { useState } from 'react';
import { hospitals, userAppointments } from '@/lib/data';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Calendar, Users, Building2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, addDays } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';

const Dashboard = () => {
  // Get the start of the current week
  const startOfCurrentWeek = startOfWeek(new Date());
  
  // Create data for the appointments chart (next 7 days)
  const appointmentsChartData = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    const dayString = format(day, 'EEE');
    const dayFormatted = format(day, 'yyyy-MM-dd');
    
    // Count appointments for this day
    const count = userAppointments.filter(appointment => {
      const hospital = hospitals.find(h => h.id === appointment.hospitalId);
      if (!hospital) return false;
      const slot = hospital.availableSlots.find(s => s.id === appointment.slotId);
      return slot?.date === dayFormatted;
    }).length;
    
    return {
      name: dayString,
      appointments: count
    };
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hospitals.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(hospitals.map(h => h.state)).size} states
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {userAppointments.length > 0 ? '+' + userAppointments.length + ' from last month' : 'No appointments yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(userAppointments.map(a => a.patientEmail)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique patient count
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hospitals.reduce((acc, hospital) => acc + hospital.availableSlots.filter(slot => !slot.isBooked).length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all hospitals
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={appointmentsChartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar
                  dataKey="appointments"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-medical-blue"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
