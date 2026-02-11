import { useState } from 'react';
import { 
  FolderOpen, 
  Languages, 
  BookOpen, 
  Settings,
  Plus,
  Upload,
  Search,
  MoreHorizontal,
  Check,
  ChevronRight,
  ChevronDown,
  FileText,
  Trash2,
  Edit3,
  Sparkles,
  RefreshCw,
  Terminal,
  Cpu,
  Eye,
  LayoutGrid,
  List,
  Send,
  Save,
  Download,
  CheckCircle2,
  PanelLeft,
  PanelLeftClose,
  Menu,
  MessageSquare,
  GitCompare,
  Globe,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ViewType = 'projects' | 'project-detail' | 'translate' | 'terms' | 'settings';
type RightPanelTab = 'ai-assist' | 'model-compare';
type ViewMode = 'split' | 'translation-only';

interface TermLibrary {
  id: string;
  name: string;
  description: string;
  termCount: number;
  scene: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  updatedAt: string;
  termLibraryId?: string;
}

interface SubtitleFile {
  id: string;
  name: string;
  lines: number;
  duration: string;
  updatedAt: string;
  status: 'processing' | 'completed' | 'pending';
  progress: number;
}

interface SubtitleLine {
  id: number;
  timeStart: string;
  timeEnd: string;
  original: string;
  translated: string;
  status: 'confirmed' | 'ai-translated' | 'untranslated';
}

interface Segment {
  id: number;
  name: string;
  startLine: number;
  endLine: number;
  status: 'confirmed' | 'reviewing' | 'pending';
  lines: SubtitleLine[];
}

const termLibraries: TermLibrary[] = [
  { id: '1', name: 'Cyberpunk_Glossary_v1', description: '赛博朋克系列专用术语库', termCount: 156, scene: '影视' },
  { id: '2', name: 'Tech_Docs_v2', description: '技术文档通用术语库', termCount: 234, scene: '技术' },
  { id: '3', name: 'Gaming_Terms', description: '游戏本地化术语库', termCount: 89, scene: '游戏' },
];

const projects: Project[] = [
  { id: '1', name: '赛博朋克: 边缘行者 Season 1', description: 'Netflix 动画剧集 S01 全集翻译项目', fileCount: 3, updatedAt: '2小时前', termLibraryId: '1' },
  { id: '2', name: 'TechVision 2024 产品发布会', description: 'Q1 全球营销视频物料，需多语言对照', fileCount: 2, updatedAt: '2024-02-01', termLibraryId: '2' },
];

const subtitleFiles: SubtitleFile[] = [
  { id: '1', name: 'EP01_Sub.srt', lines: 450, duration: '24:10', updatedAt: '10分钟前', status: 'processing', progress: 85 },
  { id: '2', name: 'EP02_Sub.srt', lines: 420, duration: '23:45', updatedAt: '昨天', status: 'completed', progress: 100 },
];

const initialSegments: Segment[] = [
  {
    id: 1,
    name: '场景：开篇独白',
    startLine: 1,
    endLine: 3,
    status: 'confirmed',
    lines: [
      { id: 1, timeStart: '00:00:12,300', timeEnd: '00:00:15,000', original: 'Welcome to Night City, where dreams come to burn.', translated: '欢迎来到夜之城，梦想焚烧之地。', status: 'confirmed' },
      { id: 2, timeStart: '00:00:16,000', timeEnd: '00:00:18,200', original: 'Plug in the Cyberdeck, we need to bypass the security grid.', translated: '接入赛博甲板，我们需要绕过安全格网。', status: 'confirmed' },
      { id: 3, timeStart: '00:00:19,000', timeEnd: '00:00:22,000', original: "Don't trust those Corpo scum, they'll sell you out.", translated: '别信那帮公司狗，他们随时会出卖你。', status: 'confirmed' },
    ]
  },
  {
    id: 2,
    name: '场景：角色对话',
    startLine: 4,
    endLine: 5,
    status: 'reviewing',
    lines: [
      { id: 4, timeStart: '00:00:23,000', timeEnd: '00:00:26,500', original: 'The Braindance is high-def, be careful with the neural spikes.', translated: '超梦是高清的。小心神经尖峰。', status: 'ai-translated' },
      { id: 5, timeStart: '00:00:27,000', timeEnd: '00:00:30,000', original: "Arasaka? He's got a death wish or something?", translated: '', status: 'untranslated' },
    ]
  },
  {
    id: 3,
    name: '场景：对峙与谈判',
    startLine: 6,
    endLine: 8,
    status: 'pending',
    lines: [
      { id: 6, timeStart: '00:01:05,200', timeEnd: '00:01:08,500', original: "You think you're so smart, don't you?", translated: '你觉得自己很聪明，是吧？', status: 'ai-translated' },
      { id: 7, timeStart: '00:01:08,500', timeEnd: '00:01:12,000', original: 'We have to bypass the security grid before the guard returns.', translated: '', status: 'untranslated' },
      { id: 8, timeStart: '00:01:12,000', timeEnd: '00:01:15,500', original: "This is a one-way trip, Jackie.", translated: '', status: 'untranslated' },
    ]
  },
];

const aiAssistSuggestions = [
  { type: '优化', text: '你以为你挺能耐的，啊？？' },
  { type: '口语化', text: '你觉得自己挺牛的，是吧？' },
  { type: '精准', text: '你觉得自己智商爆表了，对吧？' },
];

const modelCompareResults = [
  { model: 'DeepSeek-V3', text: '你以为你挺能耐的，啊？？', time: '0.8s' },
  { model: 'Claude 3.5', text: '你觉得自己很聪明，是吧？', time: '1.2s' },
  { model: 'GPT-4o', text: '你觉得自己智商爆表了，对吧？', time: '1.5s' },
];

function Sidebar({ currentView, setView, collapsed, setCollapsed }: { 
  currentView: ViewType; 
  setView: (v: ViewType) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const menuItems = [
    { id: 'projects', label: '项目管理', icon: FolderOpen },
    { id: 'translate', label: '翻译工作台', icon: Languages },
    { id: 'terms', label: '术语库', icon: BookOpen },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} bg-[#0a0c10] border-r border-gray-800/50 flex flex-col h-screen transition-all duration-300 flex-shrink-0`}>
      <div className="h-14 border-b border-gray-800/50 flex items-center justify-between px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white font-semibold text-sm">SubtitlePro</h1>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
            <Languages className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white h-7 w-7" onClick={() => setCollapsed(true)}>
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="p-2 border-b border-gray-800/50 flex justify-center">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white h-7 w-7" onClick={() => setCollapsed(false)}>
            <PanelLeft className="w-4 h-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 py-3">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-lg text-sm transition-all ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'terms' && (
                    <Badge className="bg-purple-500/20 text-purple-400 text-xs border-0">5</Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      {!collapsed && (
        <div className="p-3 border-t border-gray-800/50">
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500">
              <AvatarFallback className="text-white text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">Demo User</div>
              <div className="text-xs text-gray-500">Pro Plan</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ breadcrumbs, showActions = true }: { breadcrumbs?: string[]; showActions?: boolean }) {
  return (
    <div className="h-14 border-b border-gray-800/50 bg-[#0a0c10] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        {breadcrumbs ? (
          <div className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className={idx === breadcrumbs.length - 1 ? 'text-blue-400' : 'text-gray-500'}>
                {idx > 0 && <ChevronRight className="w-3 h-3 inline mx-1 text-gray-600" />}
                {crumb}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-white font-medium">SubtitlePro V3</span>
        )}
      </div>
      {showActions && (
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
            <Download className="w-4 h-4 mr-2" />
            导出字幕
          </Button>
        </div>
      )}
    </div>
  );
}

function ProjectManagement({ onProjectClick }: { onProjectClick: () => void }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [projectName, setProjectName] = useState('');

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">我的项目</h2>
          <p className="text-gray-500 text-sm mt-1">管理您的字幕翻译项目</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="bg-[#11131a] border-gray-800/50 hover:border-gray-700 cursor-pointer transition-all group"
            onClick={onProjectClick}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-white font-medium mb-1">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-1">{project.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-purple-500/10 text-purple-400 text-xs border-purple-500/20">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {termLibraries.find(l => l.id === project.termLibraryId)?.name || '未关联'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {project.fileCount} 个文件
                </span>
                <span>{project.updatedAt} 更新</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card 
          className="bg-[#11131a] border-gray-800/50 border-dashed hover:border-gray-600 cursor-pointer transition-colors"
          onClick={() => setCreateDialogOpen(true)}
        >
          <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[180px]">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-gray-500">创建一个新项目</span>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-[#11131a] border-gray-800/50 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>创建新项目</DialogTitle>
            <DialogDescription className="text-gray-400">
              填写项目基本信息，选择关联术语库
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300">项目名称 <span className="text-red-400">*</span></Label>
              <Input 
                placeholder="输入项目名称" 
                className="bg-[#0a0c10] border-gray-800 text-white mt-1" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-gray-300">项目描述</Label>
              <Textarea 
                placeholder="简要描述项目内容" 
                className="bg-[#0a0c10] border-gray-800 text-white mt-1" 
              />
            </div>
            <div>
              <Label className="text-gray-300">关联术语库 <span className="text-red-400">*</span></Label>
              <Select value={selectedLibrary} onValueChange={setSelectedLibrary}>
                <SelectTrigger className="bg-[#0a0c10] border-gray-700 text-white mt-1.5 h-10 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50">
                  <SelectValue placeholder="选择术语库" />
                </SelectTrigger>
                <SelectContent className="bg-[#11131a] border-gray-700 rounded-lg">
                  {termLibraries.map(lib => (
                    <SelectItem key={lib.id} value={lib.id} className="focus:bg-blue-500/20 focus:text-white">
                      {lib.name} ({lib.termCount} 条)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)} 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-6"
            >
              取消
            </Button>
            <Button 
              onClick={() => setCreateDialogOpen(false)} 
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={!projectName || !selectedLibrary}
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectDetail({ onEnterWorkspace }: { onEnterWorkspace: () => void }) {
  const [extractDialogOpen, setExtractDialogOpen] = useState(false);
  const [selectedFileForExtract, setSelectedFileForExtract] = useState<string | null>(null);
  const [extractedTerms, setExtractedTerms] = useState<Array<{original: string; translation: string; type: string}>>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // 模拟术语提取功能
  const handleExtractTerms = (fileId: string) => {
    setIsExtracting(true);
    setSelectedFileForExtract(fileId);
    
    // 模拟 API 调用延迟
    setTimeout(() => {
      const mockExtractedTerms = [
        { original: 'Braindance', translation: '超梦', type: 'proper' },
        { original: 'Cyberdeck', translation: '赛博甲板', type: 'proper' },
        { original: 'Corpo', translation: '公司狗', type: 'professional' },
        { original: 'Netrunner', translation: '网络行者', type: 'proper' },
        { original: 'Ripperdoc', translation: '义体医生', type: 'professional' },
      ];
      setExtractedTerms(mockExtractedTerms);
      setIsExtracting(false);
    }, 1500);
  };

  const handleSaveExtractedTerms = () => {
    // 模拟保存到术语库
    setExtractDialogOpen(false);
    setSelectedFileForExtract(null);
    setExtractedTerms([]);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-semibold text-white">边缘行者 S01</h2>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              <BookOpen className="w-3 h-3 mr-1" />
              Cyber_Glossary_V2
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">Netflix 动画剧集 S01 全集翻译项目</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            上传字幕文件
          </Button>
        </div>
      </div>

      <Card className="bg-[#11131a] border-gray-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-base">文件列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subtitleFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 bg-[#0a0c10] rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  file.status === 'completed' ? 'bg-green-500/10' : 
                  file.status === 'processing' ? 'bg-blue-500/10' : 'bg-gray-800/50'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    file.status === 'completed' ? 'text-green-400' : 
                    file.status === 'processing' ? 'text-blue-400' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{file.lines} 行</span>
                    <span>•</span>
                    <span>{file.duration}</span>
                    <span>•</span>
                    <span>{file.updatedAt}</span>
                  </div>
                </div>
                <div className="w-40">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={file.status === 'completed' ? 'text-green-400' : file.status === 'processing' ? 'text-blue-400' : 'text-gray-500'}>
                      {file.status === 'completed' ? '翻译完成' : file.status === 'processing' ? '正在处理' : '等待中'}
                    </span>
                    <span className="text-gray-500">{file.progress}%</span>
                  </div>
                  <Progress value={file.progress} className="h-1.5 bg-gray-800" />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setExtractDialogOpen(true);
                      handleExtractTerms(file.id);
                    }}
                    className="border-purple-700 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    术语提取
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onEnterWorkspace}
                    className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    进入工作台
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 术语提取弹窗 */}
      <Dialog open={extractDialogOpen} onOpenChange={setExtractDialogOpen}>
        <DialogContent className="bg-[#11131a] border-gray-800/50 text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              术语提取
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              从字幕文件中自动提取专业术语和专有名词
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            {isExtracting ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-400">
                  正在分析 {selectedFileForExtract ? subtitleFiles.find(f => f.id === selectedFileForExtract)?.name : '字幕文件'}，提取术语...
                </p>
              </div>
            ) : extractedTerms.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-2">
                  从 {subtitleFiles.find(f => f.id === selectedFileForExtract)?.name} 提取了 {extractedTerms.length} 个术语：
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {extractedTerms.map((term, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-[#0a0c10] rounded-lg border border-gray-800/50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 bg-[#0a0c10] text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{term.original}</span>
                            <span className="text-gray-500">→</span>
                            <span className="text-blue-400">{term.translation}</span>
                          </div>
                        </div>
                        <Badge className={
                          term.type === 'proper' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }>
                          {term.type === 'proper' ? '专有名词' : '专业术语'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                点击术语提取按钮开始分析
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setExtractDialogOpen(false)} 
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              取消
            </Button>
            {!isExtracting && extractedTerms.length > 0 && (
              <Button 
                onClick={handleSaveExtractedTerms}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                添加到术语库
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 多语言翻译数据类型
interface LanguageTranslation {
  langCode: string;
  langName: string;
  translations: Record<number, string>;
}

function TranslationWorkspace() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedLine, setSelectedLine] = useState<number>(6);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('ai-assist');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeCommand, setActiveCommand] = useState('语气强硬');
  const [segmentCollapsed, setSegmentCollapsed] = useState<Record<number, boolean>>({ 1: true, 2: false });
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [segments, setSegments] = useState<Segment[]>(initialSegments);

  // 确认分片
  const confirmSegment = (segmentId: number) => {
    setSegments(prev => prev.map(segment => {
      if (segment.id === segmentId) {
        return {
          ...segment,
          status: 'confirmed' as const,
          lines: segment.lines.map(line => ({
            ...line,
            status: line.translated ? 'confirmed' as const : line.status
          }))
        };
      }
      return segment;
    }));
  };

  // 确认单行
  const confirmLine = (segmentId: number, lineId: number) => {
    setSegments(prev => prev.map(segment => {
      if (segment.id === segmentId) {
        return {
          ...segment,
          lines: segment.lines.map(line => {
            if (line.id === lineId && line.translated) {
              return { ...line, status: 'confirmed' as const };
            }
            return line;
          })
        };
      }
      return segment;
    }));
  };
  const [retranslateDialogOpen, setRetranslateDialogOpen] = useState(false);
  
  // 多语言翻译状态
  const [activeLang, setActiveLang] = useState<string>('zh-cn');
  const [langTranslations, setLangTranslations] = useState<LanguageTranslation[]>([
    {
      langCode: 'zh-cn',
      langName: '简体中文',
      translations: {
        1: '欢迎来到夜之城，梦想焚烧之地。',
        2: '接入赛博甲板，我们需要绕过安全格网。',
        3: '别信那帮公司狗，他们随时会出卖你。',
        4: '超梦是高清的。小心神经尖峰。',
        5: '',
        6: '你觉得自己很聪明，是吧？',
        7: '',
        8: '',
      }
    },
    {
      langCode: 'zh-tw',
      langName: '繁體中文',
      translations: {
        1: '歡迎來到夜之城，夢想焚燒之地。',
        2: '接入賽博甲板，我們需要繞過安全格網。',
        3: '別信那幫公司狗，他們隨時會出賣你。',
        4: '超夢是高畫質的。小心神經尖峰。',
        5: '',
        6: '你覺得自己很聰明，是吧？',
        7: '',
        8: '',
      }
    },
    {
      langCode: 'ja',
      langName: '日本語',
      translations: {
        1: 'ナイトシティへようこそ。夢が燃え尽きる場所です。',
        2: 'サイバーデッキに接続して、セキュリティグリッドを回避する必要があります。',
        3: 'あの会社の犬どもを信じるな。いつでも裏切るぞ。',
        4: 'ブレインダンスは高画質だ。ニューラルスパイクに注意しろ。',
        5: '',
        6: '自分が賢いと思っているのか？',
        7: '',
        8: '',
      }
    },
    {
      langCode: 'en',
      langName: 'English',
      translations: {
        1: 'Welcome to Night City, where dreams come to burn.',
        2: 'Plug in the Cyberdeck, we need to bypass the security grid.',
        3: "Don't trust those Corpo scum, they'll sell you out.",
        4: 'The Braindance is high-def, be careful with the neural spikes.',
        5: '',
        6: "You think you're so smart, don't you?",
        7: '',
        8: '',
      }
    },
  ]);

  const toggleSegment = (segmentId: number) => {
    setSegmentCollapsed(prev => ({ ...prev, [segmentId]: !prev[segmentId] }));
  };

  const currentLine = segments.flatMap(s => s.lines).find(l => l.id === selectedLine);
  
  // 获取当前语言的翻译
  const getCurrentTranslation = (lineId: number) => {
    const langData = langTranslations.find(l => l.langCode === activeLang);
    return langData?.translations[lineId] || '';
  };
  
  // 更新翻译
  const updateTranslation = (lineId: number, text: string) => {
    setLangTranslations(prev => prev.map(lang => {
      if (lang.langCode === activeLang) {
        return {
          ...lang,
          translations: { ...lang.translations, [lineId]: text }
        };
      }
      return lang;
    }));
  };
  
  // 添加新语言
  const addLanguage = (langCode: string, langName: string) => {
    if (!langTranslations.find(l => l.langCode === langCode)) {
      setLangTranslations(prev => [...prev, {
        langCode,
        langName,
        translations: {}
      }]);
    }
    setActiveLang(langCode);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] animate-fade-in">
      {/* 多语言 Tab 切换栏 - 放在最上方 */}
      <div className="h-10 border-b border-gray-800/50 bg-[#0a0c10] flex items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs">目标语言:</span>
          <div className="flex items-center bg-[#11131a] rounded-lg p-1">
            {langTranslations.map((lang) => (
              <div
                key={lang.langCode}
                className={`flex items-center h-6 px-2 rounded text-xs cursor-pointer transition-all ${
                  activeLang === lang.langCode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveLang(lang.langCode)}
              >
                <Globe className="w-3 h-3 mr-1" />
                <span>{lang.langName}</span>
                {langTranslations.length > 1 && (
                  <button
                    className="ml-1 w-3 h-3 flex items-center justify-center rounded-full hover:bg-white/20 text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newLangs = langTranslations.filter(l => l.langCode !== lang.langCode);
                      setLangTranslations(newLangs);
                      if (activeLang === lang.langCode && newLangs.length > 0) {
                        setActiveLang(newLangs[0].langCode);
                      }
                    }}
                  >
                    <span className="text-[8px]">×</span>
                  </button>
                )}
              </div>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-5 w-5 p-0 border border-gray-700 rounded bg-[#0a0c10] text-gray-400 hover:text-white hover:border-gray-500 ml-1"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#11131a] border-gray-700">
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('ko', '한국어')}
                >
                  한국어 (韩语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('fr', 'Français')}
                >
                  Français (法语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('de', 'Deutsch')}
                >
                  Deutsch (德语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('es', 'Español')}
                >
                  Español (西班牙语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('ru', 'Русский')}
                >
                  Русский (俄语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('it', 'Italiano')}
                >
                  Italiano (意大利语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('pt', 'Português')}
                >
                  Português (葡萄牙语)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-800 cursor-pointer"
                  onClick={() => addLanguage('ar', 'العربية')}
                >
                  العربية (阿拉伯语)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="h-12 border-b border-gray-800/50 bg-[#0a0c10] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#11131a] rounded-lg p-0.5 border border-gray-800/50">
            <Button 
              variant="ghost" 
              size="sm"
              className={`${viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} h-7 text-xs`}
              onClick={() => setViewMode('split')}
            >
              <LayoutGrid className="w-3 h-3 mr-1" />
              对照视图
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`${viewMode === 'translation-only' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} h-7 text-xs`}
              onClick={() => setViewMode('translation-only')}
            >
              <List className="w-3 h-3 mr-1" />
              纯译文模式
            </Button>
          </div>
          <span className="text-gray-500 text-xs">当前分片: 2/12</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            已确认分片: {segments.filter(s => s.status === 'confirmed').length}/{segments.length}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white h-8 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            全部一键确认
          </Button>
          {currentLine && getCurrentTranslation(currentLine.id) ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white h-8 text-xs"
              onClick={() => setRetranslateDialogOpen(true)}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              重新翻译
            </Button>
          ) : (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
              <Play className="w-3 h-3 mr-1" />
              开始翻译
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${leftPanelCollapsed ? 'w-12' : 'w-80'} border-r border-gray-800/50 bg-[#0a0c10] flex flex-col flex-shrink-0 transition-all duration-300`}>
          <div className="h-10 border-b border-gray-800/50 flex items-center justify-between px-3 flex-shrink-0">
            {!leftPanelCollapsed && <span className="text-gray-400 text-sm font-medium">场景分块</span>}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-500 hover:text-white"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            >
              {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {!leftPanelCollapsed && (
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {segments.map((segment) => (
                  <div key={segment.id} className="space-y-1">
                    <Collapsible open={!segmentCollapsed[segment.id]} onOpenChange={() => toggleSegment(segment.id)}>
                      <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors bg-[#11131a] border border-gray-800/50 hover:border-gray-700">
                        <div className="flex items-center gap-2">
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 text-gray-500 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSegment(segment.id);
                              }}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${segmentCollapsed[segment.id] ? '-rotate-90' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <span className="text-gray-500 text-xs">#{segment.id}</span>
                          <span className="text-white text-sm">{segment.name.replace('场景：', '')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {segment.status === 'confirmed' ? (
                            <Badge className="bg-green-500/10 text-green-400 text-xs border-0">
                              <Check className="w-3 h-3 mr-1" />
                              已确认
                            </Badge>
                          ) : segment.status === 'reviewing' ? (
                            <Badge className="bg-blue-500/10 text-blue-400 text-xs border-0">校对中</Badge>
                          ) : (
                            <Badge className="bg-gray-700/50 text-gray-400 text-xs border-0">待处理</Badge>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 text-gray-500 hover:text-blue-400"
                            title="翻译此分片"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          {segment.status !== 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-gray-500 hover:text-green-400"
                              title="确认此分片"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmSegment(segment.id);
                              }}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="mt-1 space-y-1 pl-2">
                          {segment.lines.map(line => (
                            <div 
                              key={line.id}
                              onClick={() => setSelectedLine(line.id)}
                              className={`p-3 rounded-lg cursor-pointer transition-all ${
                                selectedLine === line.id 
                                  ? 'bg-blue-500/10 border border-blue-500/30' 
                                  : 'bg-[#0a0c10] border border-transparent hover:border-gray-700'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-1 pt-0.5">
                                  <span className="text-gray-500 text-xs">{line.id}</span>
                                  {line.status === 'confirmed' && <Check className="w-3 h-3 text-green-400" />}
                                  {line.status === 'ai-translated' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-400 text-sm truncate">{line.original}</p>
                                  {getCurrentTranslation(line.id) ? (
                                    <p className={`text-sm font-medium mt-1 truncate ${
                                      line.status === 'confirmed' ? 'text-green-400' : 'text-white'
                                    }`}>
                                      {getCurrentTranslation(line.id)}
                                    </p>
                                  ) : (
                                    <p className="text-gray-600 italic text-sm mt-1">等待处理...</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {line.status !== 'confirmed' && getCurrentTranslation(line.id) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-gray-500 hover:text-green-400"
                                      title="确认此行"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        confirmLine(segment.id, line.id);
                                      }}
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex-1 bg-[#0a0c10] overflow-auto">
          <div className="p-4">
            {currentLine && viewMode === 'split' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#11131a] rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs">原文 (EN)</span>
                      <span className="text-gray-500 text-xs">{currentLine.timeStart} → {currentLine.timeEnd}</span>
                    </div>
                    <p className="text-white text-base leading-relaxed">{currentLine.original}</p>
                  </div>
                  <div className="bg-[#11131a] rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 text-xs">
                        译文 ({langTranslations.find(l => l.langCode === activeLang)?.langName || activeLang.toUpperCase()})
                      </span>
                      <RefreshCw className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                    </div>
                    <textarea
                      className="w-full bg-transparent text-orange-400 text-base leading-relaxed font-medium resize-none outline-none min-h-[60px]"
                      value={getCurrentTranslation(currentLine.id)}
                      onChange={(e) => updateTranslation(currentLine.id, e.target.value)}
                      placeholder="等待翻译..."
                    />
                  </div>
                </div>

                <div className="bg-[#11131a] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-800/50 flex items-center justify-between">
                    <span className="text-gray-400 text-xs">当前分块内容</span>
                    <span className="text-gray-500 text-xs">
                      {(() => {
                        const currentSegment = segments.find(s => s.lines.some(l => l.id === currentLine.id));
                        return currentSegment ? `${currentSegment.name.replace('场景：', '')} (${currentSegment.lines.length} 行)` : '';
                      })()}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {(() => {
                      const currentSegment = segments.find(s => s.lines.some(l => l.id === currentLine.id));
                      return currentSegment?.lines.map(line => (
                        <div 
                          key={line.id} 
                          className={`flex items-start gap-3 ${line.id === currentLine.id ? 'opacity-100' : 'opacity-60'}`}
                        >
                          <span className={`text-xs w-4 ${line.id === currentLine.id ? 'text-blue-400' : 'text-gray-500'}`}>{line.id}</span>
                          <div className="flex-1">
                            <p className="text-gray-400 text-sm">{line.original}</p>
                            {getCurrentTranslation(line.id) ? (
                              <p className={`text-sm mt-0.5 ${line.id === currentLine.id ? 'text-orange-400 font-medium' : 'text-gray-500'}`}>
                                {getCurrentTranslation(line.id)}
                              </p>
                            ) : (
                              <p className="text-gray-600 italic text-sm mt-0.5">等待处理...</p>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'translation-only' && (
              <div className="space-y-4">
                <div className="bg-[#11131a] rounded-xl border border-gray-800/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800/50 flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">
                      {(() => {
                        const currentSegment = currentLine ? segments.find(s => s.lines.some(l => l.id === currentLine.id)) : segments[0];
                        return currentSegment ? currentSegment.name.replace('场景：', '') : '';
                      })()}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {(() => {
                        const currentSegment = currentLine ? segments.find(s => s.lines.some(l => l.id === currentLine.id)) : segments[0];
                        return currentSegment ? `${currentSegment.lines.filter(l => l.translated).length}/${currentSegment.lines.length} 行已翻译` : '';
                      })()}
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    {(() => {
                      const currentSegment = currentLine ? segments.find(s => s.lines.some(l => l.id === currentLine.id)) : segments[0];
                      return currentSegment?.lines.map(line => (
                        <div 
                          key={line.id} 
                          className={`p-3 rounded-lg border ${line.id === currentLine?.id ? 'bg-blue-500/10 border-blue-500/30' : 'bg-[#0a0c10] border-transparent hover:border-gray-700'} cursor-pointer transition-all`}
                          onClick={() => setSelectedLine(line.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-gray-500 text-xs w-4">{line.id}</span>
                            <div className="flex-1">
                              <p className="text-gray-400 text-sm mb-1">{line.original}</p>
                              {getCurrentTranslation(line.id) ? (
                                <p className="text-white text-sm">{getCurrentTranslation(line.id)}</p>
                              ) : (
                                <p className="text-gray-600 italic text-sm">等待处理...</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {line.status === 'confirmed' && <Check className="w-3 h-3 text-green-400" />}
                              {line.status === 'ai-translated' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-96 border-l border-gray-800/50 bg-[#0a0c10] flex flex-col flex-shrink-0">
          <div className="h-10 border-b border-gray-800/50 flex items-center px-2">
            <div className="flex items-center bg-[#11131a] rounded-lg p-0.5">
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 text-xs ${rightPanelTab === 'ai-assist' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setRightPanelTab('ai-assist')}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                AI 辅助
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 text-xs ${rightPanelTab === 'model-compare' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setRightPanelTab('model-compare')}
              >
                <GitCompare className="w-3 h-3 mr-1" />
                多模型对比
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
            <div className="p-3 space-y-4">
              {rightPanelTab === 'ai-assist' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs">作用范围:</span>
                    <div className="flex items-center bg-[#11131a] rounded-lg p-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs bg-blue-600 text-white hover:bg-blue-700"
                      >
                        当前行
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        当前分块
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-3">
                      <Sparkles className="w-4 h-4" />
                      AI 候选 & 优化建议
                      <Badge className="bg-blue-500/10 text-blue-400 text-xs border-0 ml-auto">DeepSeek-V3</Badge>
                    </div>
                    <div className="space-y-2">
                      {aiAssistSuggestions.map((suggestion, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#11131a] rounded-lg p-3 border border-gray-800/50 hover:border-gray-700 cursor-pointer transition-all hover:bg-[#151821]"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                              {suggestion.type}
                            </Badge>
                          </div>
                          <p className="text-white text-sm">{suggestion.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-800/50" />

                  <div>
                    <div className="flex items-center gap-2 text-orange-400 text-sm font-medium mb-3">
                      <Terminal className="w-4 h-4" />
                      指令配置
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['更口语化', '保留术语', '压缩长度', '语气强硬', '增加幽默感'].map((cmd) => (
                        <Button 
                          key={cmd} 
                          size="sm"
                          variant="outline"
                          className={`h-7 text-xs ${activeCommand === cmd ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                          onClick={() => setActiveCommand(cmd)}
                        >
                          {cmd}
                        </Button>
                      ))}
                    </div>

                    <Textarea 
                      placeholder="输入具体调整要求，例如：'语气更调侃一点', '保留专有名词'..."
                      className="bg-[#11131a] border-gray-800 text-white min-h-[80px] resize-none text-sm mb-2"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                      <Send className="w-3 h-3 mr-1" />
                      应用并刷新 AI 建议
                    </Button>
                  </div>
                </>
              )}

              {rightPanelTab === 'model-compare' && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs">作用范围:</span>
                    <div className="flex items-center bg-[#11131a] rounded-lg p-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs bg-blue-600 text-white hover:bg-blue-700"
                      >
                        当前行
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        当前分块
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                    <GitCompare className="w-4 h-4" />
                    多模型翻译结果对比
                  </div>

                  {/* 模型翻译结果 - 放在指令配置上面 */}
                  <div className="space-y-3 mb-4">
                    {modelCompareResults.map((item, idx) => (
                      <div key={idx} className="bg-[#11131a] rounded-lg p-3 border border-gray-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={
                            idx === 0 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs' :
                            idx === 1 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs' :
                            'bg-green-500/10 text-green-400 border-green-500/20 text-xs'
                          }>
                            {item.model}
                          </Badge>
                          <span className="text-gray-500 text-xs">{item.time}</span>
                        </div>
                        <p className="text-white text-sm">{item.text}</p>
                        <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-gray-700 bg-[#0a0c10] text-gray-300 w-full hover:bg-gray-800 hover:text-white">
                          采用此版本
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-800/50 mb-4" />

                  {/* 指令配置 - 放在模型结果下面 */}
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 text-sm font-medium mb-3">
                      <Terminal className="w-4 h-4" />
                      指令配置
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['DeepSeek-V3', 'Claude 3.5', 'GPT-4o'].map(model => (
                        <Button
                          key={model}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          {model}
                        </Button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['更口语化', '保留术语', '压缩长度', '语气强硬'].map((cmd) => (
                        <Button 
                          key={cmd} 
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          {cmd}
                        </Button>
                      ))}
                    </div>

                    <Textarea 
                      placeholder="输入指令要求..."
                      className="bg-[#11131a] border-gray-800 text-white min-h-[60px] resize-none text-sm mb-3"
                    />
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                      <Send className="w-3 h-3 mr-1" />
                      应用并刷新模型结果
                    </Button>
                  </div>
                </>
              )}

              <Separator className="bg-gray-800/50" />

              <div className="space-y-2 pb-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-sm">
                  <Save className="w-4 h-4 mr-2" />
                  保存并确认 (Ctrl+Enter)
                </Button>
                <Button variant="outline" className="w-full border-gray-700 bg-[#0a0c10] text-gray-400 h-10 text-sm hover:bg-gray-800 hover:text-white">
                  忽略此行
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={retranslateDialogOpen} onOpenChange={setRetranslateDialogOpen}>
        <DialogContent className="bg-[#11131a] border-gray-800/50 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-400" />
              重新翻译整个字幕
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              选择优化调整要求，系统将重新翻译整个字幕文件
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300 mb-2 block">优化调整要求</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {['更口语化', '保留术语', '压缩长度', '语气强硬', '增加幽默感', '正式风格'].map((cmd) => (
                  <Button 
                    key={cmd} 
                    size="sm"
                    variant="outline"
                    className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {cmd}
                  </Button>
                ))}
              </div>
              <Textarea 
                placeholder="输入具体调整要求..."
                className="bg-[#0a0c10] border-gray-800 text-white min-h-[80px]"
              />
            </div>
            <div>
              <Label className="text-gray-300 mb-2 block">选择模型</Label>
              <Select defaultValue="deepseekv3">
                <SelectTrigger className="bg-[#0a0c10] border-gray-800 text-white">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent className="bg-[#11131a] border-gray-800">
                  <SelectItem value="deepseekv3">DeepSeek-V3</SelectItem>
                  <SelectItem value="claude35">Claude 3.5</SelectItem>
                  <SelectItem value="gpt4o">GPT-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRetranslateDialogOpen(false)} className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white">
              取消
            </Button>
            <Button onClick={() => setRetranslateDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              开始重新翻译
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TermsLibrary() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState('1');

  const terms = [
    { id: '1', original: 'Night City', translation: '夜之城', type: 'proper', usage: 45 },
    { id: '2', original: 'Cyberdeck', translation: '赛博甲板', type: 'proper', usage: 23 },
    { id: '3', original: 'Corpo', translation: '公司狗', type: 'movie', usage: 18 },
    { id: '4', original: 'Braindance', translation: '超梦', type: 'proper', usage: 32 },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">术语库管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理不同场景的专业术语</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          新建术语库
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {termLibraries.map(lib => (
          <Button
            key={lib.id}
            variant={selectedLibrary === lib.id ? 'default' : 'outline'}
            className={selectedLibrary === lib.id ? 'bg-blue-600' : 'border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white'}
            onClick={() => setSelectedLibrary(lib.id)}
          >
            {lib.name}
            <Badge className="ml-2 bg-gray-700 text-gray-300">{lib.termCount}</Badge>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="搜索术语..." 
            className="pl-10 bg-[#11131a] border-gray-800 text-white"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32 bg-[#11131a] border-gray-800 text-white">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent className="bg-[#11131a] border-gray-800">
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="proper">专有名词</SelectItem>
            <SelectItem value="professional">专业</SelectItem>
            <SelectItem value="movie">影视</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#11131a] border-gray-800/50">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-[#0a0c10]">
              <tr className="text-left text-sm text-gray-500 border-b border-gray-800/50">
                <th className="px-4 py-3">原文</th>
                <th className="px-4 py-3">译文</th>
                <th className="px-4 py-3">类型</th>
                <th className="px-4 py-3">使用次数</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {terms.map((term) => (
                <tr key={term.id} className="hover:bg-gray-800/20">
                  <td className="px-4 py-3 text-white">{term.original}</td>
                  <td className="px-4 py-3 text-gray-300">{term.translation}</td>
                  <td className="px-4 py-3">
                    <Badge className={
                      term.type === 'proper' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      term.type === 'professional' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }>
                      {term.type === 'proper' ? '专有名词' : term.type === 'professional' ? '专业' : '影视'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{term.usage}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white h-8 w-8">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-400 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#11131a] border-gray-800/50 text-white">
          <DialogHeader>
            <DialogTitle>新建术语库</DialogTitle>
            <DialogDescription className="text-gray-400">
              创建不同场景下的专业词库
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300">术语库名称</Label>
              <Input placeholder="输入名称" className="bg-[#0a0c10] border-gray-800 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-300">描述</Label>
              <Textarea placeholder="描述用途" className="bg-[#0a0c10] border-gray-800 text-white mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-gray-700 bg-[#0a0c10] text-gray-300 hover:bg-gray-800 hover:text-white">取消</Button>
            <Button onClick={() => setAddDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700">创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SystemSettings() {
  const [activeProvider, setActiveProvider] = useState('OpenAI');
  const [sensitivity, setSensitivity] = useState([75]);

  return (
    <div className="p-6 animate-fade-in overflow-auto h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">全局系统设置</h2>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">V3.5 PRO</Badge>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          保存全部配置
        </Button>
      </div>

      <div className="max-w-4xl space-y-8">
        <section>
          <div className="flex items-start gap-8 mb-6">
            <div className="w-48">
              <h3 className="text-white font-medium text-lg mb-2">模型接口管理</h3>
              <p className="text-gray-500 text-sm">为不同的厂商配置独立的 API Key</p>
            </div>
            <div className="flex-1">
              <div className="flex gap-2 mb-4">
                {['OpenAI', 'DeepSeek', 'Anthropic'].map(provider => (
                  <Button
                    key={provider}
                    variant={activeProvider === provider ? 'default' : 'outline'}
                    className={activeProvider === provider ? 'bg-[#11131a] text-white border-gray-700' : 'border-gray-700 bg-[#0a0c10] text-gray-400 hover:bg-gray-800 hover:text-white'}
                    onClick={() => setActiveProvider(provider)}
                  >
                    {provider === 'OpenAI' && <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />}
                    {provider}
                  </Button>
                ))}
              </div>

              <Card className="bg-[#11131a] border-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Cpu className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">OpenAI 配置</div>
                        <div className="text-gray-500 text-sm">当前活跃提供商</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">设为首选</span>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">API BASE URL</Label>
                      <Input defaultValue="https://api.openai.com/v1" className="bg-[#0a0c10] border-gray-800 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm mb-2 block">默认模型</Label>
                      <Input defaultValue="gpt-4o" className="bg-[#0a0c10] border-gray-800 text-white" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-500 text-sm mb-2 block">API KEY</Label>
                    <div className="relative">
                      <Input type="password" defaultValue="sk-..." className="bg-[#0a0c10] border-gray-800 text-white pr-10" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="bg-gray-800/50" />

        <section>
          <div className="flex items-start gap-8">
            <div className="w-48">
              <h3 className="text-white font-medium text-lg mb-2">并发切片规则</h3>
              <p className="text-gray-500 text-sm">调整 AI 如何将长视频字幕拆分为小块</p>
            </div>
            <div className="flex-1">
              <Card className="bg-[#11131a] border-gray-800/50">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-400">语义切分敏感度</Label>
                      <span className="text-blue-400 font-medium">{sensitivity[0]}%</span>
                    </div>
                    <Slider value={sensitivity} onValueChange={setSensitivity} max={100} step={1} className="mb-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>保守 (更长上下文)</span>
                      <span>激进 (极速碎片化)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#0a0c10] rounded-xl">
                    <div>
                      <div className="text-white font-medium">长句智能截断</div>
                      <div className="text-gray-500 text-sm">自动识别对话完结点并开启新分片</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="bg-gray-800/50" />

        <section>
          <div className="flex items-start gap-8">
            <div className="w-48">
              <h3 className="text-white font-medium text-lg mb-2">翻译提示词 (Prompt)</h3>
              <p className="text-gray-500 text-sm">定义全局翻译的人格和背景知识</p>
            </div>
            <div className="flex-1">
              <Card className="bg-[#11131a] border-gray-800/50">
                <CardContent className="p-6">
                  <Label className="text-gray-500 text-sm mb-3 block">系统人格指令</Label>
                  <Textarea 
                    className="bg-[#0a0c10] border-gray-800 text-white min-h-[150px] font-mono text-sm mb-4"
                    defaultValue={`You are a professional subtitle translator. Translate the following content accurately while maintaining the original tone and slang. Do not output anything except the translation result.`}
                  />
                  <div className="flex gap-2">
                    {['# 插入科幻模板', '# 插入古装模板', '# 插入生活模板', '# 插入纪录片模板'].map(tag => (
                      <Button key={tag} variant="outline" size="sm" className="border-gray-700 bg-[#0a0c10] text-gray-400 text-xs hover:bg-gray-800 hover:text-white">
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setView] = useState<ViewType>('translate');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['项目', '边缘行者 S01', 'EP01_Sub.srt']);

  const handleProjectClick = () => {
    setView('project-detail');
    setBreadcrumbs(['项目', '边缘行者 S01']);
  };

  const handleEnterWorkspace = () => {
    setView('translate');
    setBreadcrumbs(['项目', '边缘行者 S01', 'EP01_Sub.srt']);
  };

  const handleNavClick = (view: ViewType) => {
    setView(view);
    switch (view) {
      case 'projects':
        setBreadcrumbs(['项目管理']);
        break;
      case 'translate':
        setBreadcrumbs(['项目', '边缘行者 S01', 'EP01_Sub.srt']);
        break;
      case 'terms':
        setBreadcrumbs(['术语库管理']);
        break;
      case 'settings':
        setBreadcrumbs(['系统设置']);
        break;
    }
  };

  // 判断是否在项目管理或项目详情页面
  const isProjectPage = currentView === 'projects' || currentView === 'project-detail';

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-[#0a0c10] overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          setView={handleNavClick} 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header breadcrumbs={breadcrumbs} showActions={!isProjectPage} />
          <div className="flex-1 overflow-hidden">
            {currentView === 'projects' && <ProjectManagement onProjectClick={handleProjectClick} />}
            {currentView === 'project-detail' && <ProjectDetail onEnterWorkspace={handleEnterWorkspace} />}
            {currentView === 'translate' && <TranslationWorkspace />}
            {currentView === 'terms' && <TermsLibrary />}
            {currentView === 'settings' && <SystemSettings />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
