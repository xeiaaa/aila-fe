import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import { Button, Flex, Modal, message } from "antd";

const Archive = () => {
  const queryClient = useQueryClient();

  const { data: notes } = useQuery({
    queryKey: ["archived-notes"],
    queryFn: async () => {
      const filter = JSON.stringify({ isArchived: true });
      const { data } = await authAxios.get(
        `${API_URL}/notes?limit=1000&filter=${filter}`
      );
      return data.results;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      if (!id) return;
      return authAxios.delete(`${API_URL}/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["archived-notes"] });
    },
  });

  const retrivedMutation = useMutation({
    mutationFn: (id) => {
      if (!id) return;
      return authAxios.post(`${API_URL}/notes/${id}/retrieve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["archived-notes"] });
    },
  });

  const handleDeleteNote = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Note deleted successfully!");
    } catch (err) {
      message.error("Failed to delete the note!");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete note",
      content: "Once deleted, notes cannot be recovered. Be careful.",
      onOk: () => handleDeleteNote(id),
      okButtonProps: {
        isLoading: deleteMutation.isLoading,
        disabled: deleteMutation.isLoading,
      },
      cancelButtonProps: {
        disabled: deleteMutation.isLoading,
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-7 w-full md:w-3/4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3 w-1/4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <tr
                  key={note._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-normal md:whitespace-nowrap dark:text-white"
                  >
                    {note.title}
                  </td>
                  <td className="px-6 py-4">
                    <Flex className="flex flex-col sm:flex-row gap-2 sm:gap-5">
                      <Button
                        onClick={() => retrivedMutation.mutateAsync(note._id)}
                        className="dark:bg-transparent dark:hover:!bg-transparent dark:text-textDark"
                      >
                        Retrieve
                      </Button> 
                      <Button
                        danger
                        onClick={() => handleDelete(note._id)}
                        className="dark:bg-transparent dark:hover:!bg-transparent"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center">
                  No notes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Archive;
