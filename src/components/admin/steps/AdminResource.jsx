import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Cards";
import { Badge } from "../../ui/Badge";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui-common/Tab";
import ApiService from "../../../service/ApiService";
import { GET_APIS } from "../../../../connection";
import UploadResourceDialog from "../../../common/modal/UploadResourceDialog";

import {
  Upload,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Trash2,
  Search,
  X,
} from "lucide-react";

export default function AdminResourceLibrary() {
  const toast = useRef(null);

  // ========================
  // Resource Data
  // ========================
  const [resources, setResources] = useState([
    {
      id: "1",
      title: "Science Olympiad Preparation Guide",
      type: "pdf",
      category: "Study Material",
      grade: "7",
      subject: "Science",
      uploadedDate: "2024-10-15",
      size: "2.3 MB",
      uploadedBy: "Admin",
      downloads: 145,
    },
    {
      id: "2",
      title: "Mathematics Problem Solving",
      type: "video",
      category: "Video Lecture",
      grade: "6",
      subject: "Mathematics",
      uploadedDate: "2024-10-20",
      size: "45 MB",
      uploadedBy: "Admin",
      downloads: 89,
    },
    {
      id: "3",
      title: "Physics Formulas Chart",
      type: "image",
      category: "Reference",
      grade: "8",
      subject: "Science",
      uploadedDate: "2024-11-01",
      size: "1.2 MB",
      uploadedBy: "Admin",
      downloads: 203,
    },
  ]);

  // ========================
  // Filters
  // ========================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState(null);
  const [filterSubject, setFilterSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const gradeOptions = [
    { label: "All Grades", value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `Class ${i + 1}`,
      value: `${i + 1}`,
    })),
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);

      const json = await ApiService(GET_APIS.subjectsdataurl, {
        method: "GET",
      });

      if (json.isSuccess && Array.isArray(json.data)) {
        const loadedSubjects = json.data.map((s) => ({
          label: s.subject_name,
          value: s.subject_name, // use NAME for filtering match
        }));

        setSubjects([
          { label: "All Subjects", value: null },
          ...loadedSubjects,
        ]);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };


  const filteredResources = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGrade = !filterGrade || r.grade === filterGrade;
    const matchSubject = !filterSubject || r.subject === filterSubject;

    return matchSearch && matchGrade && matchSubject;
  });

  // ========================
  // Upload Dialog
  // ========================
  const [showUpload, setShowUpload] = useState(false);

  const refreshResources = () => {
    console.log("Refresh list after upload (optional).");
    // Place your API call here if needed:
    // fetchResources();
  };


  // ========================
  // Delete
  // ========================
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteResource = () => {
    setResources(resources.filter((r) => r.id !== selected.id));
    setConfirmDeleteVisible(false);

    toast.current.show({
      severity: "success",
      summary: "Deleted",
      detail: `${selected.title} was removed.`,
    });
  };

  // ========================
  // Icons by Type
  // ========================
  const getIcon = (type) => {
    if (type === "pdf" || type === "document")
      return <FileText className="size-5 text-red-600" />;
    if (type === "video") return <Video className="size-5 text-purple-600" />;
    if (type === "image") return <ImageIcon className="size-5 text-blue-600" />;
    return <FileText className="size-5 text-gray-600" />;
  };

  // ========================
  // Resource Card Renderer
  // ========================
  function renderResourceCard(r) {
    return (
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          <div className="bg-gray-50 rounded-lg p-3">{getIcon(r.type)}</div>

          <div className="flex-1">
            <h4 className="text-blue-900">{r.title}</h4>

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-blue-50 border-2 border-blue-200">
                Class {r.grade}
              </Badge>
              <Badge className="bg-green-50 border-2 border-green-200">
                {r.subject}
              </Badge>
              <Badge className="bg-purple-50 border-2 border-purple-200">
                {r.category}
              </Badge>
            </div>

            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>{r.size}</span>
              <span>•</span>
              <span>{r.downloads} downloads</span>
              <span>•</span>
              <span>{new Date(r.uploadedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-200 rounded-md">
            <Download className="size-4" />
          </button>

          <button
            onClick={() => {
              setSelected(r);
              setConfirmDeleteVisible(true);
            }}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <Trash2 className="size-4 text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // TABS + FILTERED LIST
  // ========================
  const tabsData = [
    { value: "all", label: "All", filter: (r) => true },
    { value: "pdf", label: "PDFs", filter: (r) => r.type === "pdf" },
    { value: "video", label: "Videos", filter: (r) => r.type === "video" },
    { value: "image", label: "Images", filter: (r) => r.type === "image" },
  ];

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Resource Library</CardTitle>
              <CardDescription>
                Upload and manage educational resources
              </CardDescription>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              <Upload className="size-4" />
              Upload Resource
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search + Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                  placeholder="Search resources..."
                />
              </div>
            </div>

            {/* Grade */}
            {/* Grade Filter */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Grade</label>

              <Dropdown
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.value)}
                options={gradeOptions}
                optionLabel="label"
                placeholder="All Grades"
                className="w-full"
                showClear
              />
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>

              <Dropdown
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.value)}
                optionLabel="label"
                placeholder="All Subjects"
                className="w-full"
                showClear
                loading={loadingSubjects}
                options={subjects || []}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-blue-50 border-blue-100">
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-xl font-semibold text-blue-900">
                {resources.length}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-red-50 border-red-100">
              <p className="text-sm text-gray-600">PDFs</p>
              <p className="text-xl font-semibold text-red-900">
                {resources.filter((r) => r.type === "pdf").length}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50 border-purple-100">
              <p className="text-sm text-gray-600">Videos</p>
              <p className="text-xl font-semibold text-purple-900">
                {resources.filter((r) => r.type === "video").length}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-green-50 border-green-100">
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-xl font-semibold text-green-900">
                {resources.reduce((acc, r) => acc + r.downloads, 0)}
              </p>
            </div>
          </div>

          {/* TABS + RESOURCE LIST */}

          <Tabs defaultValue="all" className="mt-4">
            <TabsList>
              {tabsData.map((tab) => {
                const count = filteredResources.filter(tab.filter).length;
                return (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabsData.map((tab) => {
              const list = filteredResources.filter(tab.filter);

              return (
                <TabsContent key={tab.value} value={tab.value} className="mt-4">
                  {list.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <FileText className="size-12 mx-auto mb-3 text-gray-300" />
                      No {tab.label.toLowerCase()} found
                    </div>
                  ) : (
                    list.map((r) => (
                      <Card
                        key={r.id}
                        className="hover:shadow-md mb-3 border border-gray-300"
                      >
                        <CardContent className="p-4">
                          {renderResourceCard(r)}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <UploadResourceDialog
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={refreshResources}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        visible={confirmDeleteVisible}
        onHide={() => setConfirmDeleteVisible(false)}
        message="Are you sure you want to delete this resource?"
        header="Confirm Delete"
        icon="pi pi-exclamation-triangle"
        accept={deleteResource}
        reject={() => setConfirmDeleteVisible(false)}
      />
    </div>
  );
}
