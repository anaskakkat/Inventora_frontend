import  { useEffect, useState } from "react";
import moment from "moment";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Mail,
  ChevronDown,
  ShoppingBag,
  BarChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/card";
import { InventoryItem, ReportData, Sale } from "@/utils/type";
import {
  handlePrint,
  exportToExcel,
  exportToPDF,
  sendEmail,
} from "@/utils/reportUtils";
import Api from "@/config/axiosConfig";
import Pagination from "@/components/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loader from "@/components/Loader";

type ExportType = "print" | "excel" | "pdf" | "email-pdf" | "email-excel";
type ReportType = "sales" | "items";

const Reports = () => {
  const [activeReport, setActiveReport] = useState<ReportType>("sales");
  const [showEmailDropdown, setShowEmailDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [itemsData, setItemsData] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const Email_USER = useSelector(
    (state: RootState) => state.authUser.userInfo?.email
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [salesResponse, itemsResponse] = await Promise.all([
          Api.get("/sale"),
          Api.get("/items"),
        ]);
        setSalesData(salesResponse.data);
        setItemsData(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCurrentData = (): ReportData => {
    let data;
    if (activeReport === "sales") {
      data = {
        headers: ["Date", "Customer", "Items", "Total"],
        rows: salesData.map((sale) => [
          `${moment(sale.date).format("DD-MM-YYYY")}`,
          sale.customerId.name,
          sale.items
            .map((item) => `${item.name} ₹${item.total} x ${item.quantity}`)
            .join("\n"),
          `₹${sale.totalAmount}`,
        ]),
      };
    } else {
      data = {
        headers: ["Sr .No", "Item Name", "Stock"],
        rows: itemsData.map((item, index) => [
          index + 1,
          item.name,
          item.quantity,
        ]),
      };
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      ...data,
      rows: data.rows.slice(startIndex, endIndex),
    };
  };

  const getTotalPages = (): number => {
    const totalItems =
      activeReport === "sales" ? salesData.length : itemsData.length;
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = async (type: ExportType): Promise<void> => {
    const data = getCurrentData();
    try {
      setLoading(true);
      switch (type) {
        case "print":
          handlePrint();
          break;
        case "excel":
          exportToExcel(data, activeReport);
          break;
        case "pdf":
          exportToPDF(data, activeReport);
          break;
        case "email-pdf":
          await sendEmail("pdf", data, activeReport, Email_USER as string);
          setShowEmailDropdown(false);
          break;
        case "email-excel":
          await sendEmail("excel", data, activeReport, Email_USER as string);
          setShowEmailDropdown(false);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button
                  onClick={() => setActiveReport("sales")}
                  variant={activeReport === "sales" ? "default" : "outline"}
                  className={`rounded-full px-6 py-2 transition-all duration-200 ${
                    activeReport === "sales"
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                      : "hover:border-blue-400"
                  }`}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Sales Report
                </Button>
                <Button
                  onClick={() => setActiveReport("items")}
                  variant={activeReport === "items" ? "default" : "outline"}
                  className={`rounded-full px-6 py-2 transition-all duration-200 ${
                    activeReport === "items"
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                      : "hover:border-blue-400"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Items Report
                </Button>
              </div>

              {/* Export Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleExport("print")}
                  variant="outline"
                  className="rounded-full bg-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  onClick={() => handleExport("excel")}
                  variant="outline"
                  className="rounded-full  bg-green-100 hover:bg-green-500 text-green-600 border-green-200 hover:border-green-300 hover:text-white px-2 py-1"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button
                  onClick={() => handleExport("pdf")}
                  variant="outline"
                  className="rounded-full bg-red-100 hover:bg-red-500 text-red-600 border-red-200 hover:border-red-300 hover:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <div className="relative">
                  <Button
                    onClick={() => setShowEmailDropdown(!showEmailDropdown)}
                    variant="outline"
                    className="rounded-full bg-blue-100 hover:bg-blue-800 text-blue-600 border-blue-200 hover:border-blue-300 hover:text-black py-2"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                  {showEmailDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                      <button
                        onClick={() => handleExport("email-pdf")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Send as PDF
                      </button>
                      <button
                        onClick={() => handleExport("email-excel")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Send as Excel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto" id="printable-table">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {getCurrentData().headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {getCurrentData().rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-pre-line text-sm text-gray-600"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={getTotalPages()}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
