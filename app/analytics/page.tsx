import { DataTable } from "@/components/data-table"

const mockData = [
    {
        id: 1,
        header: "Cover Page",
        type: "Cover Page",
        status: "Done",
        target: "1",
        limit: "1",
        reviewer: "Eddie Lake",
    },
    {
        id: 2,
        header: "Table of Contents",
        type: "Table of Contents",
        status: "Done",
        target: "2",
        limit: "3",
        reviewer: "Jamik Tashpulatov",
    },
    {
        id: 3,
        header: "Executive Summary",
        type: "Executive Summary",
        status: "In Progress",
        target: "5",
        limit: "8",
        reviewer: "Emily Whalen",
    },
    {
        id: 4,
        header: "Technical Approach",
        type: "Technical Approach",
        status: "In Progress",
        target: "10",
        limit: "15",
        reviewer: "Eddie Lake",
    },
    {
        id: 5,
        header: "Design Specifications",
        type: "Design",
        status: "Not Started",
        target: "8",
        limit: "12",
        reviewer: "Assign reviewer",
    },
    {
        id: 6,
        header: "Company Capabilities",
        type: "Capabilities",
        status: "Done",
        target: "6",
        limit: "10",
        reviewer: "Jamik Tashpulatov",
    },
    {
        id: 7,
        header: "Past Performance",
        type: "Narrative",
        status: "In Progress",
        target: "4",
        limit: "6",
        reviewer: "Emily Whalen",
    },
    {
        id: 8,
        header: "Key Personnel",
        type: "Narrative",
        status: "Not Started",
        target: "3",
        limit: "5",
        reviewer: "Assign reviewer",
    },
    {
        id: 9,
        header: "Focus Documents",
        type: "Focus Documents",
        status: "Done",
        target: "7",
        limit: "10",
        reviewer: "Eddie Lake",
    },
    {
        id: 10,
        header: "Project Timeline",
        type: "Narrative",
        status: "In Progress",
        target: "5",
        limit: "7",
        reviewer: "Jamik Tashpulatov",
    },
    {
        id: 11,
        header: "Quality Assurance",
        type: "Technical Approach",
        status: "Not Started",
        target: "4",
        limit: "6",
        reviewer: "Assign reviewer",
    },
    {
        id: 12,
        header: "Risk Management",
        type: "Narrative",
        status: "Done",
        target: "3",
        limit: "5",
        reviewer: "Emily Whalen",
    },
]

const Analytics = () => {
    return (
        <>
            <DataTable data={mockData}/>
        </>
    );
};

export default Analytics

