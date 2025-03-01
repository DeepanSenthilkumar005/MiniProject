import { useParams } from "react-router-dom";

const AddItem = () => {
  const { category } = useParams();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-indigo-500">
        Add New {category}
      </h1>
      <form className="mt-4 space-y-4">
        <input
          type="text"
          placeholder={`Enter ${category} details`}
          className="border border-gray-300 p-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
