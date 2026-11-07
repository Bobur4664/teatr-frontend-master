import { useState } from "react";
import { getPerformances, getTeamMembers, getNews } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { tr } from "@/lib/tr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, BarChart3, MessageSquare, Bell, Archive, Video, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";

export default function Admin() {
  const { t } = useTranslation();
  const [ticketsSold, setTicketsSold] = useState("1,240");
  const [isEditingTickets, setIsEditingTickets] = useState(false);

  const { data: performances } = useApi(() => getPerformances(), []);
  const { data: actors } = useApi(() => getTeamMembers('aktyorlar'), []);
  const { data: news } = useApi(() => getNews(), []);

  return (
    <div className="pt-12 pb-32 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-foreground">{t('admin.dashboard')}</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">{t('admin.welcome')}</p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90 rounded-none uppercase tracking-widest text-[10px] font-bold">
              <Bell className="w-4 h-4 mr-2" />
              Push-xabar yuborish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-8">
          <TabsList className="bg-muted border border-border rounded-none p-1 h-auto flex flex-wrap">
            <TabsTrigger value="stats" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              <BarChart3 className="w-4 h-4 mr-2" /> Statistika
            </TabsTrigger>
            <TabsTrigger value="performances" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              Spektakllar
            </TabsTrigger>
            <TabsTrigger value="actors" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              Aktyorlar
            </TabsTrigger>
            <TabsTrigger value="news" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              Yangiliklar
            </TabsTrigger>
            <TabsTrigger value="archive" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              <Archive className="w-4 h-4 mr-2" /> Arxiv
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-none px-8 py-3 uppercase tracking-widest text-[10px] font-bold data-[state=active]:bg-primary">
              <MessageSquare className="w-4 h-4 mr-2" /> Moderatsiya
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-muted border-border rounded-none">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest">Eng ko'p ko'rilgan spektakl</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-serif font-bold text-foreground">O'tkan Kunlar</p>
                  <p className="text-xs text-primary mt-2">+12% o'tgan haftaga nisbatan</p>
                </CardContent>
              </Card>
              <Card className="bg-muted border-border rounded-none">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest">Eng ko'p "Like" olgan aktyor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-serif font-bold text-foreground">Ulug'bek Qodirov</p>
                  <p className="text-xs text-primary mt-2">2,500 ta'rif</p>
                </CardContent>
              </Card>
              <Card className="bg-muted border-border rounded-none relative group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest">Sotilgan chiptalar</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditingTickets(!isEditingTickets)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingTickets ? (
                    <div className="flex gap-2">
                      <Input 
                        value={ticketsSold} 
                        onChange={(e) => setTicketsSold(e.target.value)}
                        className="bg-background border-border text-foreground h-8 text-sm"
                      />
                      <Button size="sm" onClick={() => setIsEditingTickets(false)} className="h-8 bg-primary">OK</Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-serif font-bold text-foreground">{ticketsSold}</p>
                      <p className="text-xs text-primary mt-2">Bu oy hisobidan</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performances" className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-foreground">Spektakllar ro'yxati</h3>
              <Button className="bg-primary hover:bg-primary/90 rounded-none uppercase tracking-widest text-[10px] font-bold">
                <Plus className="w-4 h-4 mr-2" /> Yangi qo'shish
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-primary border-b border-border uppercase tracking-widest text-[11px] font-semibold">
                  <tr>
                    <th className="p-5">Nomi</th>
                    <th className="p-5">Janr</th>
                    <th className="p-5">Rejissyor</th>
                    <th className="p-5">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {performances.filter((p: any) => p.status !== 'archived').map((p: any) => (
                    <tr key={p.id} className="text-muted-foreground hover:bg-secondary/40 transition-colors">
                      <td className="p-5 font-bold text-foreground">{tr(p.title)}</td>
                      <td className="p-5">{tr(p.genre?.name) || '—'}</td>
                      <td className="p-5">{tr(p.director_name)}</td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="hover:text-primary"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="archive" className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-foreground">Arxivlangan spektakllar</h3>
              <Button className="bg-primary hover:bg-primary/90 rounded-none uppercase tracking-widest text-[10px] font-bold">
                <Plus className="w-4 h-4 mr-2" /> Tarixiy spektakl qo'shish
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-primary border-b border-border uppercase tracking-widest text-[11px] font-semibold">
                  <tr>
                    <th className="p-5">Nomi</th>
                    <th className="p-5">Premyera yili</th>
                    <th className="p-5">Media</th>
                    <th className="p-5">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {performances.filter((p: any) => p.status === 'archived').map((p: any) => (
                    <tr key={p.id} className="text-muted-foreground hover:bg-secondary/40 transition-colors">
                      <td className="p-5 font-bold text-foreground">{tr(p.title)}</td>
                      <td className="p-5 italic">{new Date(p.premiere_date).getFullYear()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {p.video_url && <Video className="w-4 h-4 text-primary" />}
                          {p.gallery_images?.length > 0 && <ImageIcon className="w-4 h-4 text-primary" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="hover:text-primary"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-foreground">Yangi izohlar (Moderatsiya)</h3>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-muted border border-border p-6 flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-bold">Foydalanuvchi #{i}</span>
                        <span className="text-muted-foreground text-xs">2 soat avval</span>
                      </div>
                      <p className="text-muted-foreground">Juda ajoyib spektakl bo'ldi, barchaga tavsiya qilaman!</p>
                      <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Spektakl: O'tkan Kunlar</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-green-900 text-green-500 hover:bg-green-900/20 rounded-none text-[10px] font-bold uppercase tracking-widest">Tasdiqlash</Button>
                      <Button variant="outline" className="border-red-900 text-red-500 hover:bg-red-900/20 rounded-none text-[10px] font-bold uppercase tracking-widest">O'chirish</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
