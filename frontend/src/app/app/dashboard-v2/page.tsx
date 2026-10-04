'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const subscriptionData = [
  { name: 'Jan', value: 240 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 278 },
  { name: 'Aug', value: 189 },
];

const revenueData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 12000 },
  { name: 'Apr', value: 18000 },
  { name: 'May', value: 14000 },
  { name: 'Jun', value: 22000 },
  { name: 'Jul', value: 20000 },
  { name: 'Aug', value: 25000 },
];

export default function DashboardV2() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-white">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="default" className="bg-gray-900 text-white hover:bg-gray-800">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Team Members */}
        <Card className="col-span-1 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
              Team Members
              <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium cursor-pointer">
                i
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a" alt="Avatar" />
                  <AvatarFallback>TB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-gray-900">Toby Belhome</p>
                  <p className="text-sm text-gray-500 mt-0.5">contact@bundui.io</p>
                </div>
              </div>
              <Select defaultValue="viewer">
                <SelectTrigger className="w-[100px] h-8 text-xs bg-gray-50/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=b" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-gray-900">Jackson Lee</p>
                  <p className="text-sm text-gray-500 mt-0.5">pre@example.com</p>
                </div>
              </div>
              <Select defaultValue="developer">
                <SelectTrigger className="w-[100px] h-8 text-xs bg-gray-50/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=c" alt="Avatar" />
                  <AvatarFallback>HG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-gray-900">Hally Gray</p>
                  <p className="text-sm text-gray-500 mt-0.5">hally@site.com</p>
                </div>
              </div>
              <Select defaultValue="viewer">
                <SelectTrigger className="w-[100px] h-8 text-xs bg-gray-50/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=d" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-gray-900">Sofia Davis</p>
                  <p className="text-sm text-gray-500 mt-0.5">m@example.com</p>
                </div>
              </div>
              <Select defaultValue="member">
                <SelectTrigger className="w-[100px] h-8 text-xs bg-gray-50/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column */}
        <div className="col-span-1 space-y-6 flex flex-col">
          <Card className="shadow-sm border-gray-100 flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">+4850</div>
              <p className="text-xs text-green-500 font-medium mt-1">+180.1% from last month</p>
              
              <div className="h-[120px] mt-6 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionData}>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Exercise Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mt-1">Your exercise minutes are ahead of where you normally are.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <Card className="col-span-1 shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">$15,231.89</div>
            <p className="text-xs text-green-500 font-medium mt-1">+20.1% from last month</p>
            
            <div className="h-[200px] mt-8 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#334155' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
